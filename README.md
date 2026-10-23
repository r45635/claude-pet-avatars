<div align="center">

# claude-pet avatars

**Looks for [claude-pet](https://github.com/r45635/claude-pet), the tiny creature that shows what Claude Code is doing.**

<img src="https://raw.githubusercontent.com/r45635/claude-pet/main/docs/media/avatar-ghost.gif" width="110" alt="Ghost"> <img src="https://raw.githubusercontent.com/r45635/claude-pet/main/docs/media/avatar-alien.gif" width="110" alt="Alien"> <img src="https://raw.githubusercontent.com/r45635/claude-pet/main/docs/media/avatar-mint.gif" width="110" alt="Mint"> <img src="https://raw.githubusercontent.com/r45635/claude-pet/main/docs/media/avatar-cowboy.gif" width="110" alt="Cowboy"> <img src="docs/media/avatar-slime.gif" width="110" alt="Slime"> <img src="docs/media/avatar-baptawan.gif" width="110" alt="Baptawan"> <img src="https://raw.githubusercontent.com/r45635/claude-pet/main/docs/media/avatar-halloween.gif" width="110" alt="Halloween"> <img src="https://raw.githubusercontent.com/r45635/claude-pet/main/docs/media/avatar-noel.gif" width="110" alt="Noël">

</div>

## 🎨 Designers wanted

Every avatar here is a few pictures in a folder — and every Claude Code user who installs
claude-pet can pick yours from the creature's menu. **A robot, a cat, a dragon, pixel art, your
team's mascot?** The creature can wear it:

- **Draw it however you like:** a few PNG/GIF/WebP pictures (any tool, or an image AI), an
  SVG, or a sprite sheet the tooling cuts for you.
- **Start small:** one picture (`IDLE`) is a valid avatar; each extra state — thinking,
  coding, waiting for you, in trouble… — is a bonus.
- **The pet does the acting:** breathing, storms, subagents walking around come for free.

👉 **[How to make one — the contributing guide](CONTRIBUTING.md)** ·
**[Ideas waiting for a designer](https://github.com/r45635/claude-pet-avatars/issues?q=is%3Aopen+label%3A%22good+first+avatar%22)** ·
**[Show yours](https://github.com/r45635/claude-pet-avatars/discussions)**

## In the library

| Avatar | `id` | Kind | Notes |
|---|---|---|---|
| Ghost | `ghost` | pictures | floats, with its own flicker |
| Alien | `alien` | pictures | |
| Mint | `mint` | SVG | |
| Cowboy | `cowboy` | SVG | |
| Slime | `slime` | SVG | a face for every state, wiggles on tool calls |
| Baptawan | `baptawan` | pictures | a picture for each of the nine states (AI-assisted artwork) |
| Halloween, Noël, Nouvel An, Pâques, Saint-Valentin | `halloween`, `noel`, `nouvel-an`, `paques`, `saint-valentin` | SVG | seasonal |

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

The friendly version is [CONTRIBUTING.md](CONTRIBUTING.md); the full format is
[docs/AVATARS.md](https://github.com/r45635/claude-pet/blob/main/docs/AVATARS.md) in the main
repository (the 160×160 box, states, the SVG contract, the `animations` section). In short:

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

This library is the only home of the ready-made avatars: the main repository no longer
keeps copies (its tests use their own fixtures, and validate these when this clone sits next
to it).
