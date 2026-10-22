# Design an avatar for claude-pet

Thanks for wanting to dress the creature! Here is everything you need, from the first sketch
to your avatar showing up in every user's menu.

## 1. Draw

The creature lives in a **160 × 160** square, transparent background, **feet near the bottom
centre (about 80, 146)**, head below the top edge. Keep to that and the pet needs nothing else
to place it.

It has **nine moods**. Only the first is required — every other one falls back to `ACTIVE`,
then to `IDLE` — so start with one picture and add moods when you feel like it:

| State | When | Ideas |
|---|---|---|
| `IDLE` | Claude is idle — **required** | asleep, calm, eyes closed |
| `ACTIVE` | any work, when you don't draw the specific one | eyes open, alert |
| `THINKING` | the model is working | looking up, a thought bubble |
| `READING` | reading files, searching | a book, eyes down |
| `CODING` | writing code | typing, `</>` |
| `TOOL_CALL` | running a command or a tool | a wrench, a lever |
| `HIGH_LOAD` | a storm of activity | flustered, sparks |
| `WAITING` | **waiting for the human** | hand up, a `?` |
| `DONE` | the turn is finished | happy, a check mark |
| `ERROR` | a tool failed | worried, a `!` |

Formats: **PNG, GIF, WebP, JPEG** (animated GIF/WebP/APNG play as they are) or **SVG**. Up to
2 MB per file, 10 MB in all. You don't have to animate anything: the pet adds breathing,
shaking in a storm, and walking for subagents on top of your pictures.

Already have a **sprite sheet** (a grid of frames, one row per mood)? The tooling cuts it for
you:

```bash
npm run avatar -- from-sheet sheet.png avatars/robot --cell 192x208 --id robot --name Robot \
  --map IDLE=0,THINKING=1:6,CODING=2,WAITING=3,DONE=4:5,ERROR=5:4 --license MIT
```

(run from a clone of [claude-pet](https://github.com/r45635/claude-pet); see
[docs/AVATARS.md](https://github.com/r45635/claude-pet/blob/main/docs/AVATARS.md#tooling)).

## 2. Describe it

A folder `avatars/<id>/` with your files and a `manifest.json`:

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

- `id`: lowercase letters, digits and dashes.
- `license` is **required here** (an SPDX identifier; MIT preferred). Only submit artwork you
  made or are allowed to redistribute under that license — and if an AI helped, say so in the
  pull request.
- Drawn off-centre, or not the usual shape? Add `anchors` and a `hitbox` — see
  [the common box](https://github.com/r45635/claude-pet/blob/main/docs/AVATARS.md#the-common-box).
- SVG, own animations, per-language names: all in
  [docs/AVATARS.md](https://github.com/r45635/claude-pet/blob/main/docs/AVATARS.md).

## 3. Try it

Clone this repository and [claude-pet](https://github.com/r45635/claude-pet) side by side, then:

```bash
cd claude-pet
npm run avatar -- validate ../claude-pet-avatars/avatars/robot   # the same rules as CI
npm run avatar -- pack ../claude-pet-avatars/avatars/robot       # → robot.claudepet
```

Drag `robot.claudepet` onto your creature to wear it for real. Or preview every mood in a
browser, without installing anything:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --allow-file-access-from-files \
  "file://$PWD/apps/widget/web/index.html#demo=avatar&avatar=robot&state=WAITING&kids=2"
```

## 4. Share it

Open a pull request with your folder. The template asks for a short checklist and **a
screenshot or GIF** — that's what we look at first. CI validates and packs it; once merged and
released, it appears in everyone's *Avatar ▸ Library* menu.

Not ready to draw but have an idea? Open an **Avatar idea** issue. Looking for something to
draw? Pick an issue labelled
[**good first avatar**](https://github.com/r45635/claude-pet-avatars/issues?q=is%3Aopen+label%3A%22good+first+avatar%22).
