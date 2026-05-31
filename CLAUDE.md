# CLAUDE.md

Rules for any Claude session working on this project. Read this file once per session, then follow the workflow below.

---

## ⛳ Step 0 — Read the docs first (token discipline)

This project has dedicated documentation in `docs/` specifically so you don't have to re-grep the whole codebase every session. **Before exploring any files, before running any searches, before answering any non-trivial question about the code:**

1. Read `docs/ARCHITECTURE.md` — the mental model for the whole project: tech stack, file structure, the universal demo-page template, the shared chrome (CSS + JS), how scroll demos work, the fullscreen system.
2. Read `docs/CODEBASE.md` — the file-by-file map: which files exist, line counts, what each chapter's demos cover, the pager chain rules.
3. Read `docs/FEATURES.md` — the catalog of every demo (112 of them) plus every shell feature (theme toggle, fullscreen, copy-clipboard, toast, navbar).

These three docs cover ~99% of what you'd otherwise discover by reading individual HTML/CSS/JS files. **Always start with them.**

After reading them, you should know:
- The repo is a static site (HTML/CSS/vanilla JS, zero build) with 119 HTML files.
- All demos follow the **universal demo page template** documented in `ARCHITECTURE.md §4`.
- The shared chrome lives in `assets/css/global.css` + `assets/css/components.css` + `assets/js/global.js` — three files only.
- Each demo is self-contained: scoped CSS inline in its `<style>` block, scoped JS inline at the bottom.

If you need a specific file's contents, open it directly. Don't crawl directories speculatively when the doc says what's there.

---

## ⛳ Step 1 — Make the change

Whatever the user asked for. Standard rules apply (read the file you're editing first, prefer edits over rewrites, no emojis unless asked, etc.).

If you're adding a new demo, follow the **"Adding a new demo — the checklist"** in `docs/ARCHITECTURE.md §9` exactly.

---

## ⛳ Step 2 — Update the docs (mandatory, same response)

After **every file change**, in the same response, update the relevant doc(s). This is not optional — stale docs defeat their purpose and waste future sessions' tokens.

### When to update which doc

| If you changed… | Update at minimum |
|---|---|
| Added a new demo page | `docs/FEATURES.md` (new row in the chapter's table) + `docs/CODEBASE.md` (new row in the chapter's file table + bump line counts if you ran `wc -l`) + the chapter `index.html` cat-grid + the prev demo's pager + the root `index.html` totals (4 places) |
| Deleted a demo page | Same as above in reverse |
| Renamed a demo file | All references in `docs/CODEBASE.md` + the pager chain (prev/next of the renamed demo and its neighbors) + the chapter `index.html` |
| Edited `assets/css/global.css` | `docs/ARCHITECTURE.md §5` (the bullet list under "global.css") + `docs/CODEBASE.md §3` |
| Edited `assets/css/components.css` | `docs/ARCHITECTURE.md §5` (the components.css bullet list) + `docs/CODEBASE.md §3` |
| Edited `assets/js/global.js` | `docs/ARCHITECTURE.md §5` (the global.js numbered list) + `docs/CODEBASE.md §3` + `docs/FEATURES.md` "Shell features" if behavior changed |
| Added/changed shared CSS tokens | `docs/ARCHITECTURE.md §7` token table |
| Added a per-page CDN library (GSAP / a font / etc.) | `docs/CODEBASE.md §5` CDN table |
| Changed the demo page template | `docs/ARCHITECTURE.md §4` template block |
| Changed the fullscreen system | `docs/ARCHITECTURE.md §8` and `docs/FEATURES.md` shell features #5 |
| Reorganized chapters or renamed files | `docs/CODEBASE.md` file tables + `docs/ARCHITECTURE.md §3` file tree + `docs/FEATURES.md` chapter tables |

### Counts that need to stay in sync

There are **four places** that show the total demo count, and they all must match:

1. `index.html` — three spots: `.meta-text` ("N entries"), four `.hero-stats` values, `.catalog .head .num` ("6 chapters · N entries").
2. `index.html` — each chapter's bento tile shows its own entry count (`.tile .meta span`).
3. `pages/N-*/index.html` — each chapter's `.cat-hero .ch-num` ("Chapter NN · X entries").
4. `docs/CODEBASE.md` — the per-chapter "X demos, Y total lines" headers, and the totals at the top of the file.
5. `docs/FEATURES.md` — chapter headings ("Chapter X · Topic (N demos)").

After changing counts, do a quick `grep -n "112\|111\|113" index.html docs/*.md` (replace with current/old numbers) to make sure no stale value lingers.

---

## ⛳ Step 3 — Final answer

When summarizing what you did to the user, mention:

1. The files you changed (paths).
2. The docs you updated.
3. Any total-count updates.

Don't pretend the doc update was a separate task — bundle it into the same response so the user sees the work as one atomic change.

---

## Project-specific conventions to honor

- **No build step.** Don't add npm, vite, webpack, parcel, postcss, sass, tailwind, or any framework. The site opens directly from the filesystem and that's a feature.
- **No frameworks.** Vanilla HTML/CSS/JS only. If you reach for React/Vue/Svelte, push back first.
- **No image assets.** Every visual is a CSS gradient, SVG, or unicode glyph. Placeholder.co URLs are acceptable for true mockups but the existing demos use none.
- **Per-page CDN libraries are OK** (GSAP, Lenis, SplitType, etc.) — load them only on the demo pages that need them, never globally.
- **Editorial dark-luxury shell.** The shell uses Fraunces (display) + Inter Tight (body) + JetBrains Mono (code) on warm-dark backgrounds with a single amber accent. Don't change this for "neutrality."
- **Individual demos can be wildly different aesthetics** — that's the entire point. Don't impose the shell's palette on the demos.
- **Every demo is self-contained.** All demo-specific CSS lives inside its `<style>` block, all demo-specific JS inside its inline `<script>`. Don't extract "shared" demo CSS into the global stylesheet — duplication is intentional so each page works as a copy-paste recipe.
- **The pager chain matters.** When inserting a new demo, you must update both neighbors' pagers, not just the new file.
- **Don't break the fullscreen toggle.** `assets/js/global.js` injects `.demo-fs` into every `.demo`. Don't add elements with class `.demo` that aren't actual demos.

---

## What "good" looks like (mini-rubric)

A high-quality edit on this project:

- ✅ Changed only what the user asked for.
- ✅ Followed the demo page template exactly (if adding a demo).
- ✅ Updated all four count locations if totals changed.
- ✅ Updated the relevant doc files in the same response.
- ✅ Did not introduce a build step, framework, or image asset.
- ✅ Used existing tokens (`var(--accent)` etc.) instead of hardcoding colors that should match the shell.
- ✅ Preserved the prev/next pager chain.
- ✅ Briefly summarized the file list + doc updates in the final message.

---

## Quick reference (so you don't have to grep)

| Need to find… | Look at |
|---|---|
| The mental model | `docs/ARCHITECTURE.md` |
| What file does what | `docs/CODEBASE.md` |
| What features exist | `docs/FEATURES.md` |
| The original spec | `docs/MASTER_PROMPT.md` |
| All color/type/spacing tokens | `assets/css/global.css` `:root` block |
| The fullscreen toggle implementation | `assets/js/global.js` (last section) + `assets/css/components.css` (Demo Fullscreen section) |
| The template a new demo must follow | `docs/ARCHITECTURE.md §4` |
| The checklist for adding a demo | `docs/ARCHITECTURE.md §9` |
| Which CDN libs are used and where | `docs/CODEBASE.md §5` |
