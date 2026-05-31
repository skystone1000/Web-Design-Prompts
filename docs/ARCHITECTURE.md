# ARCHITECTURE.md

> **For Claude / contributors:** This file is the canonical mental model for this codebase. Read it before exploring files individually. Pair with `CODEBASE.md` (file-by-file map) and `FEATURES.md` (catalog of demos + shell features). See `/CLAUDE.md` at the repo root for the rules around keeping these in sync.

---

## 1. What this project is

A static reference catalog called **"Vibe Design Reference"** — a living gallery of **112 web-design techniques**, each with:

1. A plain-English explanation (*What it is* + *How it works*)
2. A live, interactive demo
3. A copy-paste prompt that produces that effect when given to an AI builder (Claude, v0, Cursor, Lovable, Framer AI, etc.)
4. A list of real example sites to study

The project is the rendered output of `MASTER_PROMPT.md` (which itself was generated from `~/Downloads/Web_Design_Guide_Vibe_Coder.docx`) — significantly expanded beyond the original 39 entries.

The deliverable is **plain HTML / CSS / vanilla JS** — open `index.html` in any modern browser, no build, no install, no server.

---

## 2. Tech stack & non-negotiables

| Layer | Choice | Why |
|---|---|---|
| Markup | Static HTML files | One file per demo — copy-paste-able, no abstraction tax |
| Styling | Vanilla CSS with custom properties | Tokens live on `:root`, theming via `data-theme` attr |
| Behavior | Vanilla JavaScript (no framework) | Zero build step; works opened directly from filesystem |
| Type | `Fraunces` (display serif) + `Inter Tight` (body) + `JetBrains Mono` (code) | Editorial dark-luxury feel; avoids generic AI fonts |
| Third-party libs | CDN, per-page only | GSAP / Lenis / SplitType etc. only loaded by the pages that need them |
| Images | **None.** All visuals are CSS gradients, SVG, or unicode | Keeps the repo lightweight + every demo offline-friendly |

**Constraints to honor:**
- No build tooling (no npm, no bundler). If you reach for one, push back first.
- No frameworks (no React/Vue/Svelte). Each demo page is self-contained HTML.
- The shell stays **dark-luxury minimal**; demos can be wildly different aesthetics (that's the point).
- Every demo gets its own demo CSS scoped inline inside `<style>` to avoid cross-contamination.

---

## 3. File structure

```
website/
├── index.html                  Root catalog page (hero, 6 bento tiles, vocab grid)
├── CLAUDE.md                   Rules for Claude — read docs first, keep docs fresh
├── docs/
│   ├── ARCHITECTURE.md         (this file) High-level mental model
│   ├── CODEBASE.md             File-by-file reference
│   ├── FEATURES.md             Catalog of every demo + shell feature
│   ├── MASTER_PROMPT.md        The original "build the site" prompt (kept for reference)
│   └── Web_Design_Guide_Vibe_Coder.docx   Source guide the prompt was generated from
├── assets/
│   ├── css/
│   │   ├── global.css          Tokens (colors, type, spacing) + reset + primitives
│   │   └── components.css      Shared chrome: navbar, prompt-card, pager, fullscreen
│   └── js/
│       └── global.js           Theme toggle, navbar scroll, copy-clipboard, fullscreen
└── pages/
    ├── 1-aesthetics/
    │   ├── index.html          Chapter overview + grid of demo cards
    │   ├── 1.1-glassmorphism.html
    │   ├── 1.2-neumorphism.html
    │   └── … (16 demos total)
    ├── 2-scroll-animation/     (38 demos — biggest chapter)
    ├── 3-layouts/              (14 demos)
    ├── 4-navigation/           (14 demos)
    ├── 5-typography-color/     (13 demos)
    └── 6-ui-patterns/          (17 demos)
```

**Total:** 119 HTML files (1 root + 6 chapter indexes + 112 demos) + 2 CSS + 1 JS + 4 docs.

---

## 4. Demo page template (the universal structure)

Every individual demo page (`pages/N-*/N.M-name.html`) follows this **exact** section order. New demos must match this shape so the navigation chain and shared chrome keep working.

```
<!doctype html><html data-theme="dark">
<head>
  <!-- title, meta -->
  <link rel="stylesheet" href="../../assets/css/global.css" />
  <link rel="stylesheet" href="../../assets/css/components.css" />
  <!-- (optional) Google Fonts / Fontshare links specific to this demo -->
  <!-- (optional) per-page CDN: GSAP, Lenis, SplitType — only if needed -->
  <style>
    /* DEMO-SPECIFIC CSS, scoped via a unique prefix like .glass-demo .glass-card */
  </style>
</head>
<body>
  <div class="grain" aria-hidden="true"></div>      <!-- subtle noise overlay -->

  <header class="nav">…</header>                     <!-- shared sticky navbar -->

  <section class="entry-hero">                       <!-- chapter badge + title + tagline -->
    <span class="num-badge">1.1 · Aesthetic</span>
    <h1 class="title">…</h1>
    <p class="tagline">…</p>
  </section>

  <section class="entry-section">                    <!-- "What it is" card -->
    <h2>What it is</h2>
    <div class="body"><p>…</p></div>
  </section>

  <section class="entry-section">                    <!-- "How it works" + term grid -->
    <h2>How it works</h2>
    <div class="body">
      <p>…</p>
      <div class="term-grid">…</div>
    </div>
  </section>

  <section class="entry-section">                    <!-- (optional) Tip callout -->
    <div class="tip">…</div>
  </section>

  <section class="entry-section">                    <!-- LIVE DEMO — full-bleed -->
    <h2>Live demo</h2>
    <div class="demo-shell">
      <div class="demo XYZ-demo">                    <!-- unique class per demo -->
        <span class="demo-badge">Live</span>
        <!-- … the actual interactive demo content … -->
        <!-- A .demo-fs button is auto-injected here by global.js -->
      </div>
    </div>
  </section>

  <section class="entry-section">                    <!-- Copy-this-prompt code block -->
    <h2>Copy this prompt</h2>
    <div class="prompt-card">
      <div class="prompt-head">
        <span class="lang">Prompt · 1.1 Glassmorphism</span>
        <button class="copy-btn">…</button>
      </div>
      <pre class="prompt-body"><code>…the exact prompt text…</code></pre>
    </div>
  </section>

  <section class="entry-section">                    <!-- Example sites list -->
    <h2>Example sites to study</h2>
    <ul class="examples">…</ul>
  </section>

  <section class="entry-section">                    <!-- Prev / Next pager -->
    <div class="pager">
      <a href="…" class="prev">…</a>
      <a href="…" class="next">…</a>
    </div>
  </section>

  <footer class="foot">…</footer>

  <!-- (optional) per-demo inline <script> for interactivity -->
  <script src="../../assets/js/global.js"></script>
</body></html>
```

The pager **always** links to the next/previous demo in chapter order, and the last demo of each chapter links to the first demo of the next chapter (or back to home for chapter 6).

---

## 5. The shared chrome — three files do everything

### `assets/css/global.css` (~362 lines)

The design system foundation. **Edit here when:** you want to change brand colors, type scale, spacing, or add another generic primitive.

- `@import` Google Fonts (Fraunces, Inter Tight, JetBrains Mono)
- `:root` and `[data-theme="light"]` token blocks — bg, fg, accent, radii, shadows, ease
- Reset + body baseline
- Typography primitives (`.display`, `.h1..h4`, `.eyebrow`, `.lede`, `.muted`)
- Layout primitives (`.container`, `.container-narrow`, `.section`, `.rule`)
- `.btn` variants, `.card`, `.term-grid`, `.tip`, `.num-badge`, `.examples`
- The `.demo` and `.demo-badge` base styling
- The `.grain` noise overlay

### `assets/css/components.css` (~700 lines)

Site chrome and page-template-specific blocks. **Edit here when:** you want to change the navbar, the prompt-card look, the pager, or the fullscreen toggle behavior.

- `.nav` (sticky, frosted-glass on scroll)
- `.nav-trail` (breadcrumb)
- `.theme-toggle` (sun/moon SVG swap)
- `.prompt-card`, `.copy-btn`
- `.pager`
- `.foot`
- `.toast` (transient bottom-center notification)
- Entry-page sections (`.entry-hero`, `.entry-section`)
- `.cat-grid` (chapter index card grid) & `.cat-hero`
- `.demo-fs` button + `.demo.is-fullscreen` state + `.demo-placeholder` + `.demo-fs-hint`

### `assets/js/global.js` (~219 lines)

All page-wide behavior. **Edit here when:** you add new shared interaction. Six concerns, in this order:

1. **Theme bootstrap** — read `localStorage('vibe-theme')` or `prefers-color-scheme`, apply `data-theme` to `<html>`.
2. **Toast** — `showToast(msg)` helper used by copy-prompt success messages.
3. **Navbar scroll** — adds `.scrolled` to `.nav` when `window.scrollY > 24`.
4. **Theme toggle click** — flips `data-theme` and persists to `localStorage`.
5. **Copy-prompt buttons** — `navigator.clipboard.writeText(promptBody)`, swap to "Copied ✓", toast, revert after 1.8s.
6. **Demo fullscreen** — auto-injects a `.demo-fs` button into every `.demo`, handles enter/exit by moving the demo to `<body>` and leaving a `.demo-placeholder` behind. Esc key closes.

The script is wrapped in an IIFE — no globals leak. All listeners are attached after `DOMContentLoaded`.

---

## 6. How a typical scroll-animation demo works

Most of Chapter 2's 38 demos use this pattern:

1. The `.demo` element has `height: 720px` and `overflow-y: scroll` — it's a **scoped scroll container**, not the page itself. This keeps the demo isolated from the page's own scroll.
2. Inside, a `position: sticky; top: 0` "pin" wrapper lives inside a tall (1800–2800px) parent that provides scroll distance.
3. A `scroll` listener on the demo container computes a normalized progress `p` (0 → 1) from `tall.getBoundingClientRect()` vs the scroller's viewport.
4. `p` is assigned to a CSS custom property (e.g. `pin.style.setProperty('--p', p)`) on the pin element.
5. All visual transforms are written in CSS using `calc()` against `var(--p)`. The CSS does the animation; the JS just updates one number.

The "peak-at-middle" variants (cards spread, doors open, type shatter) map `p` through `1 - |p - 0.5| × 2` so the effect happens then reverses across the scroll.

**The fullscreen toggle works with this pattern automatically.** When a demo is moved to `<body>` in fullscreen mode, its scroll math still works because `getBoundingClientRect()` on the inner content stays correct relative to the scroller's viewport.

---

## 7. Design tokens & theming

All visual tokens live as CSS custom properties on `:root` in `global.css`:

| Token | Dark default | Light default |
|---|---|---|
| `--bg` | `#0E0E12` | `#F6F2E9` |
| `--bg-elev` | `#16161C` | `#FFFFFF` |
| `--bg-card` | `#1B1B23` | `#FFFFFF` |
| `--text` | `#F2EFE7` | `#1A1814` |
| `--accent` | `#E8B339` (warm amber) | `#B8851D` |
| `--accent-2` | `#D96F5A` (sienna coral) | — |
| `--accent-3` | `#6FB5A8` (muted teal) | — |
| `--font-display` | `'Fraunces', serif` | same |
| `--font-body` | `'Inter Tight', system-ui, sans-serif` | same |
| `--font-mono` | `'JetBrains Mono', monospace` | same |

The `data-theme="light"` selector overrides the dark values. The theme toggle in the navbar flips this and persists the choice to `localStorage`.

**Note:** Individual demo pages frequently override `--bg` etc. inside their own scoped CSS to display a specific aesthetic (e.g. Vaporwave's pastel pinks). This is intentional and doesn't interfere with the shell.

---

## 8. The fullscreen demo system

A late-added feature so users can interact with the larger scroll demos without the awkward "scroll inside a small box" experience.

**Mechanism (global.js):**

1. On `DOMContentLoaded`, walk every `.demo` element on the page and append a small floating `.demo-fs` button (top-left).
2. On click, `enterFullscreen(demo)`:
   - Remember `demo.parentNode`, `nextSibling`, `window.scrollY`.
   - Insert a `.demo-placeholder` card in the demo's old slot so the page layout doesn't collapse.
   - `document.body.appendChild(demo)` — moves the demo out of any clipping ancestor.
   - Add `.is-fullscreen` to the demo and `.demo-fullscreen-open` to `<body>`.
3. Exit (button, Esc, or "Bring demo back" in placeholder) reverses everything and restores scroll position.

**Why move to `<body>` rather than position:fixed in-place?**
Some chapter pages have clipping ancestors (e.g. demos sit inside `entry-section`). Moving to body guarantees the fullscreen demo escapes any `overflow: hidden` or transform-creating ancestor.

**Why a placeholder?** So the page doesn't reflow when the demo leaves. The placeholder is the same size as the original `.demo` (`min-height: 380px`).

The CSS for all this is in `components.css` under `/* ---------------------- Demo Fullscreen Toggle ---------------------- */`.

---

## 9. Adding a new demo — the checklist

1. **Pick the chapter number** (1–6) and the next sub-number in sequence.
2. **Create** `pages/N-cat/N.M-slug.html` using the demo page template (section 4 above).
3. Inside the page, write:
   - Demo CSS scoped under a unique class prefix (e.g. `.my-demo`).
   - Demo HTML inside `.demo .my-demo` with a `.demo-badge`.
   - "What it is" / "How it works" / Tip / Example sites copy.
   - The prompt code block (the EXACT prompt that would produce this demo).
4. **Wire the pager**: link `prev` to the previous demo and `next` to the next demo (or the next chapter's index if it's the last in this chapter).
5. **Update the chapter index** at `pages/N-cat/index.html`:
   - Bump the "Chapter NN · X entries" count.
   - Add a new `.card` link in the `.cat-grid`.
6. **Update the previously-last demo's pager** to point to your new demo instead of jumping to the next chapter.
7. **Update the root `index.html`**:
   - Bump the total entry count in the hero meta + `hero-stats` + bento tile + "6 chapters · NN entries".
8. **Update `docs/FEATURES.md`** with the new entry.
9. **If you changed shared CSS or JS**, also update `docs/ARCHITECTURE.md` and `docs/CODEBASE.md`.

---

## 10. Things that intentionally don't exist

| Not in the project | Why |
|---|---|
| Build system / bundler | Zero-install browsing is a feature |
| Image assets | CSS gradients + SVG can express everything we need |
| Routing library | One HTML file per page; relative links handle the rest |
| State management | Each page is its own world; localStorage handles theme |
| Tests | The demos are the spec; visual review is the verification |
| Backend / API | Static site, fully client-rendered |

If a feature request implies any of these, push back before adding.
