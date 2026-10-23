# Design an avatar for claude-pet

Thanks for wanting to dress the creature! This guide takes you from the first sketch to your
avatar showing up in every user's menu. No coding needed, and you can do all of it in a browser.

**In short:** draw at least one 160 × 160 picture, add a small `manifest.json`, and open a pull
request. CI checks your avatar, a maintainer looks at it, and the next release ships it.

## 1. Draw

The creature lives in a **160 × 160** square with a transparent background. Put its **feet near
the bottom centre (about 80, 146)** and keep its head below y ≈ 30. Stick to that and the pet
needs nothing else to place it. Leave a few pixels of margin, because the creature breathes and
shakes.

It has **nine moods**. Only `IDLE` is required. A missing mood falls back to `ACTIVE`, then to
`IDLE`; `DONE` falls back to `IDLE` directly. So start with one picture and add moods whenever
you like:

| State | When | Ideas |
|---|---|---|
| `IDLE` | Claude is idle (**required**) | asleep, calm, eyes closed |
| `ACTIVE` | any work, when you haven't drawn the specific mood (pictures only) | eyes open, alert |
| `THINKING` | the model is working | looking up, a thought bubble |
| `READING` | reading files, searching | a book, eyes down |
| `CODING` | writing code | typing, `</>` |
| `TOOL_CALL` | running a command or a tool | a wrench, a lever |
| `HIGH_LOAD` | a storm of activity | flustered, sparks |
| `WAITING` | **waiting for the human** | hand up, a `?` |
| `DONE` | the turn is finished | happy, a check mark |
| `ERROR` | a tool failed | worried, a `!` |

`WAITING` and `ERROR` are the moods that need the user, so make them easy to tell apart.

**Formats:** PNG, GIF, WebP or JPEG pictures, or one SVG. The limits are 2 MB per file, 10 MB
in all, and 40 files at most. Animated GIF, WebP and APNG pictures play as they are, but **keep
`IDLE` still**: an animated idle picture keeps the CPU busy while the creature sleeps. You don't
have to animate anything, because the pet adds breathing, shaking in a storm and walking for
subagents on top of your pictures.

**Using an image AI?** It works well. Ask for the same character at the same size and position
in every image, full body, feet at the bottom, on a transparent background. There's a
ready-made prompt in
[docs/AVATARS.md](https://github.com/r45635/claude-pet/blob/main/docs/AVATARS.md#tips).

**Already have a sprite sheet** (a grid of frames, one row per mood)? The tooling cuts it up
for you, from a clone of [claude-pet](https://github.com/r45635/claude-pet):

```bash
npm run avatar -- from-sheet sheet.png ../claude-pet-avatars/avatars/robot --cell 192x208 \
  --id robot --name Robot --map IDLE=0,THINKING=1:6,CODING=2,WAITING=3,DONE=4:5,ERROR=5:4 --license MIT
```

## 2. Describe it

Put your pictures in a folder `avatars/<id>/` next to a `manifest.json`:

```json
{
  "format": 1,
  "id": "robot",
  "name": "Robot",
  "names": { "fr": "Robot" },
  "author": "Your Name",
  "license": "MIT",
  "version": "1.0.0",
  "kind": "images",
  "states": { "IDLE": "idle.png", "ACTIVE": "active.png", "WAITING": "waiting.png" }
}
```

- `id` is the folder name: lowercase letters, digits and dashes, up to 40 characters.
- `name` and `author` are 1 to 60 characters each. `names` gives the avatar a name per
  language, optionally.
- `license` is **required here**: an SPDX identifier such as `MIT` (preferred) or `CC-BY-4.0`.
- Files sit flat in the folder, with no subfolders.
- Drew it off-centre, or in an unusual shape? Add `anchors` and a `hitbox`; see
  [the common box](https://github.com/r45635/claude-pet/blob/main/docs/AVATARS.md#the-common-box).
- For an SVG avatar, your own animations, and the rest of the format, see
  [docs/AVATARS.md](https://github.com/r45635/claude-pet/blob/main/docs/AVATARS.md). For SVG,
  start from [`avatars/mint/creature.svg`](avatars/mint/creature.svg), a commented template.

## 3. Try it (optional, recommended)

You need [Node.js](https://nodejs.org) 23.6 or later and git. Nothing else to install:
there's no `npm install` step. Clone both repositories side by side:

```bash
git clone https://github.com/r45635/claude-pet
git clone https://github.com/r45635/claude-pet-avatars
cd claude-pet
npm run avatar -- validate ../claude-pet-avatars/avatars/robot   # the same rules as CI
npm run avatar -- pack ../claude-pet-avatars/avatars/robot       # → robot.claudepet
```

- **On a Mac with claude-pet installed**, drag `robot.claudepet` onto your creature to wear it
  for real.
- **Anywhere else**, preview every mood in Chrome without installing anything. Use any
  `state`, and `kids` sets the number of subagents:

  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --allow-file-access-from-files \
    "file://$PWD/apps/widget/web/index.html#demo=avatar&avatar=robot&state=WAITING&kids=2"
  ```

  On Linux or Windows, the same flag and URL should work with your Chrome or Chromium.

Can't run any of this? That's fine: CI runs the same checks on your pull request and tells you
what to fix.

## 4. Share it

**With git:** push your folder to a fork and open a pull request.

**From the browser, no git:**
1. On this repository, click **Fork**.
2. In your fork, choose **Add file → Create new file**, name it `avatars/robot/manifest.json`
   (the slashes create the folder), and paste your manifest.
3. Open the new `avatars/robot/` folder, choose **Add file → Upload files**, and drop your
   pictures.
4. Click **Contribute → Open pull request**.

The pull request template asks for a short checklist and **a screenshot or GIF**, which is what
we look at first. CI validates and packs your avatar. For a first-time contributor, a
maintainer may need to start CI. A maintainer then reviews the avatar. Once it is merged and a
release is published, it appears in everyone's **Avatar → Library** menu.

**Updating your avatar later?** Bump `version` in the manifest. That's what makes the app
offer the update.

Not ready to draw, but have an idea? Open an
[Avatar idea](../../issues/new?template=avatar-idea.yml) issue. Looking for something to draw?
Pick an issue labelled
[**good first avatar**](https://github.com/r45635/claude-pet-avatars/issues?q=is%3Aopen+label%3A%22good+first+avatar%22).
Stuck? Ask in [Discussions](https://github.com/r45635/claude-pet-avatars/discussions). Nobody
minds a beginner question.

## What we accept

The creature sits on people's work desktops, and the library is public. So:

- **Your own work, or work you may share.** Submit only artwork you made, or that you have the
  right to redistribute under the license you name.
- **No one else's characters, logos or brands.** That means no fan art of a film, game or
  cartoon, and no company mascot or logo, unless you own it. Your team's mascot is fine if
  your team agrees to release it under the avatar's license.
- **Real people only with their consent.** If an avatar is based on a real person, including
  from a photo, that person agrees to it. For a child, a parent or guardian agrees.
- **AI help is welcome; say so.** Name the tool in the pull request. You may also mention it in
  `author`, for example `"Ana (AI-assisted artwork)"`. You're still the one making sure the
  result doesn't copy someone else's character.
- **Friendly for every audience.** Nothing violent, sexual, hateful or mocking a group of
  people.
- **Be kind** in issues, reviews and Discussions.

Maintainers may decline or remove an avatar that doesn't fit, and will say why. If you think an
avatar in the library breaks these rules, [tell us](README.md#something-wrong).
