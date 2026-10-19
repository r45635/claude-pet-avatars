# claude-pet avatars

The avatar library for [claude-pet](https://github.com/r45635/claude-pet): each folder under
[`avatars/`](avatars) is one avatar — a `manifest.json` plus pictures or an SVG — and every
tagged release publishes them as installable `.claudepet` packages together with a signed
`index.json` the app reads.

## Installing an avatar

- **From the app** (claude-pet ≥ 0.3.0): right-click the creature → *Avatar* → *Library*, pick
  one. Updates appear in the same menu when this repository ships a newer version; *Remove
  current avatar…* uninstalls it.
- **From a terminal** (claude-pet ≥ 0.3.1; what an agent should use):
  `~/.claude-pet/app/claude-pet avatars list`, then `… avatars install <id>`, `… avatars update`,
  `… avatars remove <id>`. From a clone of claude-pet: `npm run avatars -- install <id>`.
- **By hand:** download a `.claudepet` from the [latest release](../../releases/latest) and
  drop it on the creature.

## How the pipeline works

On every push, CI validates each avatar with the main repository's own tooling (a sibling
checkout — the rules can never drift) and packs it **reproducibly** (fixed mtimes, sorted
entries: the same content always gives the same bytes, so the published SHA-256 means
something). On a tag `v*` it also signs `index.json` with the claude-pet release key and
publishes everything as release assets:

- `<id>.claudepet` — one per avatar
- `index.json` — `{format, generated, avatars:[{id, name, names, version, kind, license,
  author, file, sha256, bytes}]}`
- `index.json.sig` — ed25519 over `index.json`, base64; the app refuses an unsigned or
  tampered index.

`https://github.com/r45635/claude-pet-avatars/releases/latest/download/index.json` is the
stable catalog URL.

## Contributing an avatar

Read the format guide first: [docs/AVATARS.md](https://github.com/r45635/claude-pet/blob/main/docs/AVATARS.md)
in the main repository (the 160×160 box, states, the SVG contract, the `animations` section).
Then:

1. Add your folder under `avatars/<id>/` — flat files, a `manifest.json` with `name`,
   `version`, `author`, and a **`license`** (an SPDX identifier; required here, MIT preferred).
2. Check it locally against the same rules CI uses:
   `node ../claude-pet/scripts/avatar.ts validate avatars/<id>`
3. Open a pull request. CI validates, packs twice and compares the bytes (determinism check).

Bump `version` whenever the content changes — that is what makes the app offer the update.

## License

MIT — © 2026 Vincent Cruvellier, see [LICENSE](LICENSE). The license covers this repository
**including the avatar artwork**; an individual avatar may declare a different (SPDX) license
in its manifest, which then applies to that avatar's files.

> The same 9 avatars currently also live in the main repository as examples and test
> fixtures; this library is the distribution channel. Deduplicating the two is future work.
