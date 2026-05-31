# CODEBASE.md

> **For Claude / contributors:** This is the file-by-file map. Pair with `ARCHITECTURE.md` (the *why*) and `FEATURES.md` (the *what works*). When you add, move, rename, or delete a file, **update the relevant entry below in the same commit**.

Current totals (verified):

| Slice | Count | Notes |
|---|---|---|
| Total `.html` files | **119** | 1 root + 6 chapter indexes + 112 demos |
| CSS files | 2 | `global.css`, `components.css` |
| JS files | 1 | `global.js` |
| Documentation files | 3 + CLAUDE.md | This dir + repo-root rules file |
| Total HTML LOC | ~30,400 | Inlined demo CSS is the bulk |
| Foundation LOC | 1,531 | `index.html` + 2 CSS + 1 JS |

---

## 1. Root files

| Path | Lines | Purpose |
|---|---|---|
| `index.html` | 386 | Landing page. Hero (display headline + meta + stats), 6 bento category tiles linking into `pages/N-*/index.html`, quick-reference vocabulary grid, final tip callout, footer. **Counts to update when adding demos:** hero meta-text ("N entries"), `.hero-stats` 4 numbers, `.catalog .head .num` ("6 chapters · N entries"), `.bento .tile .meta span` per chapter. |
| `CLAUDE.md` | 122 | Rules for any Claude session — read docs first, keep them in sync. See `/CLAUDE.md`. |

---

## 2. Documentation (`docs/`)

| Path | Purpose |
|---|---|
| `docs/ARCHITECTURE.md` | High-level system: tech choices, page template, shared chrome, theming, demo mechanics, fullscreen system, "things that don't exist" |
| `docs/CODEBASE.md` | **(this file)** File-by-file map |
| `docs/FEATURES.md` | Catalog of every demo (by chapter) + shell features (theme toggle, fullscreen, copy, toast, navbar scroll) |
| `docs/MASTER_PROMPT.md` | The original "build the entire site" prompt generated from the source `.docx`. Kept for reference and history (774 lines). |
| `docs/Web_Design_Guide_Vibe_Coder.docx` | The source guide the prompt was generated from. Original input artifact. |

When you add a new file, add a row here. When you delete one, remove its row. When you rename, update the path.

---

## 3. Assets

### `assets/css/global.css` (~362 lines)

Design-system foundation. Imports Fraunces + Inter Tight + JetBrains Mono from Google Fonts.

| Section (in order) | What it defines |
|---|---|
| `:root` | Color tokens (bg, bg-elev, bg-card, text, accent, accent-2, accent-3), font tokens, radii (radius-sm/radius/lg/xl), max-widths, shadows, eases |
| `[data-theme="light"]` | Light-mode overrides for the same tokens |
| Reset | `*, body, html` reset + smoothing |
| Typography primitives | `.display`, `h1..h4` / `.h1..h4`, `.lede`, `.eyebrow`, `.muted`, `.dim`, `.text-accent`, `.italic`, `.serif`, `.mono`, `.center` |
| Layout primitives | `.container`, `.container-narrow`, `.section`, `.section-sm`, `.section-lg`, `.rule`, `.rule-accent` |
| `.btn` family | `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-link` |
| `.card` | Base card with hover border |
| `.term-grid` | 2-col responsive grid used in "How it works" sections |
| `.tip` | Amber-bordered callout box with ✦ |
| `.num-badge` | Small chapter-number pill |
| `.examples` | The "Example sites to study" list with → arrows |
| `.demo` + `.demo-badge` | Base demo container styling |
| `.grain` | Fixed full-screen SVG noise overlay at low opacity |

### `assets/css/components.css` (~700 lines)

Site chrome and demo-page section blocks. Edit here for navbar, prompt-card, pager, fullscreen.

| Section | Defines |
|---|---|
| Navbar | `.nav`, `.nav.scrolled`, `.nav-inner`, `.nav-logo` (with glowing dot), `.nav-trail` (breadcrumbs), `.nav-actions`, `.theme-toggle` (sun/moon SVG swap) |
| Prompt card | `.prompt-card`, `.prompt-head`, `.copy-btn`, `.prompt-body` |
| Pager | `.pager`, `.pager .prev/.next`, `.pager .label/.title` |
| Footer | `.foot`, `.foot-inner` |
| Toast | `.toast`, `.toast.show` |
| Entry-page blocks | `.entry-hero`, `.entry-section` |
| Category index | `.cat-grid`, `.cat-grid .card`, `.cat-hero` |
| Demo fullscreen | `.demo-fs` (button), `.demo.is-fullscreen` (active state), `body.demo-fullscreen-open` (scroll lock), `.demo-placeholder` (DOM placeholder), `.demo-fs-hint` (transient Esc hint) |

### `assets/js/global.js` (~219 lines)

IIFE wrapping all global behavior. **Six concerns in this exact order:**

1. **Theme bootstrap** — reads `localStorage('vibe-theme')` or `prefers-color-scheme`, applies `data-theme="dark"|"light"` to `<html>` *before* the page renders to avoid flash.
2. **Toast helper** — `showToast(msg)` ensures a single `.toast` element and shows/hides it for 1.8s.
3. **`ready(fn)`** — small DOMContentLoaded helper.
4. **Navbar scroll handler** — adds `.scrolled` to `.nav` when `window.scrollY > 24`.
5. **Theme toggle click** — flips `data-theme` and persists.
6. **Copy-prompt buttons** — for every `.copy-btn` (default targets sibling `.prompt-body`), copies the prompt text to clipboard, swaps button content to "Copied ✓", calls `showToast('Prompt copied')`, reverts after 1.8s.
7. **Demo fullscreen** — auto-injects `.demo-fs` into every `.demo`; click toggles in/out by moving the demo to `<body>`, inserting `.demo-placeholder` in its old slot, locking body scroll, restoring on Esc.

No exports; everything is wired by selector. New shared behavior should land here.

---

## 4. Chapter pages

Each chapter has the same structure:
- `pages/N-cat/index.html` — chapter overview (`.cat-hero` + `.cat-grid` of demo cards + chapter prev/next pager).
- `pages/N-cat/N.M-slug.html` — individual demo pages following the universal template described in `ARCHITECTURE.md` §4.

### Chapter 1 — Aesthetics (16 demos, 4,320 lines)

`pages/1-aesthetics/`

| # | File | Topic |
|---|---|---|
| 1.1 | `1.1-glassmorphism.html` | Frosted-glass cards over a violet gradient |
| 1.2 | `1.2-neumorphism.html` | Soft UI music player with dual box-shadows |
| 1.3 | `1.3-brutalism.html` | Thick black borders, yellow accents, rotated cards |
| 1.4 | `1.4-minimalism.html` | Photography portfolio in Cormorant Garamond |
| 1.5 | `1.5-bento-grid.html` | Mixed-size feature card grid |
| 1.6 | `1.6-dark-luxury.html` | Vercel-style near-black + electric blue |
| 1.7 | `1.7-retro-y2k.html` | Hot pink + cyan + lime + chrome text |
| 1.8 | `1.8-claymorphism.html` | Inflated 3D buttons with multi-layer shadows |
| 1.9 | `1.9-aurora-mesh.html` | Soft animated mesh-gradient blobs |
| 1.10 | `1.10-cyberpunk-synthwave.html` | Neon perspective grid + sunset gradient |
| 1.11 | `1.11-editorial-magazine.html` | Drop cap + paper-cream + column rules |
| 1.12 | `1.12-vaporwave.html` | Pastel marble + Greek bust + Japanese subtitles |
| 1.13 | `1.13-memphis.html` | 80s Milan: zigzags + hard offset shadows |
| 1.14 | `1.14-swiss-grid.html` | 12-col Helvetica + one red accent + grid toggle |
| 1.15 | `1.15-liquid-goo.html` | SVG goo filter merging blobs and buttons |
| 1.16 | `1.16-sketch.html` | Excalidraw-style hand-drawn wobble |

### Chapter 2 — Scroll & Animation (38 demos, 10,272 lines)

`pages/2-scroll-animation/` — the largest chapter; many use the scoped-scroll-container pattern described in `ARCHITECTURE.md` §6.

| # | File | Topic |
|---|---|---|
| 2.1 | `2.1-parallax.html` | 3-layer depth parallax in a sky scene |
| 2.2 | `2.2-scroll-triggered.html` | IntersectionObserver fade-up with stagger |
| 2.3 | `2.3-horizontal-scroll.html` | Horizontal card track with scroll-snap + progress bar |
| 2.4 | `2.4-sticky-pinning.html` | Phone mockup pinned, screen swaps with right-column scroll |
| 2.5 | `2.5-text-reveal.html` | Word-by-word fade-up with stagger |
| 2.6 | `2.6-scroll-progress.html` | Top reading progress bar |
| 2.7 | `2.7-smooth-scroll-lenis.html` | Lenis via CDN with on/off toggle |
| 2.8 | `2.8-magnetic-cursor.html` | Custom cursor that grows + magnetic CTA |
| 2.9 | `2.9-3d-tilt.html` | 3D card tilt with light reflection tracking cursor |
| 2.10 | `2.10-number-counter.html` | Stats count from zero on enter view |
| 2.11 | `2.11-stacking-cards.html` | Cards stack on top of each other on scroll |
| 2.12 | `2.12-clip-reveal.html` | clip-path slit reveal + zoom |
| 2.13 | `2.13-svg-draw.html` | SVG path draws via stroke-dashoffset |
| 2.14 | `2.14-marquee.html` | Triple-band infinite text marquee |
| 2.15 | `2.15-hover-preview.html` | Link list with cursor-tracking preview image |
| 2.16 | `2.16-page-loader.html` | 0→100 counter curtain page intro |
| 2.17 | `2.17-exploded-assembly.html` | Device explodes in 3D, reassembles |
| 2.18 | `2.18-image-sequence.html` | 24-frame scroll-scrubbed rotation |
| 2.19 | `2.19-3d-rotate-scroll.html` | CSS 3D cube full rotation on both axes |
| 2.20 | `2.20-cinematic-zoom.html` | Huge outlined word shrinks while orb grows |
| 2.21 | `2.21-cross-section.html` | Building cake-slice layers with labels |
| 2.22 | `2.22-color-morph.html` | Page palette morphs as each section enters view |
| 2.23 | `2.23-svg-path-follow.html` | Element travels winding SVG path with waypoints |
| 2.24 | `2.24-globe-rotate.html` | CSS sphere rotates with orbiting city labels |
| 2.25 | `2.25-handoff.html` | Same element morphs between 3 scenes |
| 2.26 | `2.26-phone-sync.html` | Phone frame pinned, inner screen scrolls with page |
| 2.27 | `2.27-liquid-morph.html` | SVG path interpolates between 4 blob shapes |
| 2.28 | `2.28-card-spread.html` | Tilted deck of cards fans out into a row |
| 2.29 | `2.29-camera-dolly.html` | 7-depth-layer perspective dolly into a landscape |
| 2.30 | `2.30-iris-aperture.html` | 6-blade camera shutter opens/closes |
| 2.31 | `2.31-origami-fold.html` | 4 paper panels hinge open in 3D |
| 2.32 | `2.32-particle-assembly.html` | Canvas sparks coalesce into the word "AURORA" |
| 2.33 | `2.33-clock-gears.html` | 4 interlocking gears + clock hands |
| 2.34 | `2.34-filmstrip.html` | 35mm filmstrip slides through projector gate |
| 2.35 | `2.35-door-open.html` | Riveted vault doors slide apart with light beam |
| 2.36 | `2.36-type-shatter.html` | Headline letters fly apart in 3D, reform |
| 2.37 | `2.37-mask-wipe.html` | clip-path wipe with diagonal / circle / bars variants |
| 2.38 | `2.38-book-open.html` | 3D book opens cover then turns a page |

### Chapter 3 — Layouts (14 demos, 3,956 lines)

`pages/3-layouts/`

| # | File | Topic |
|---|---|---|
| 3.1 | `3.1-f-pattern.html` | F-shape reading layout + heatmap toggle |
| 3.2 | `3.2-hero-feature-grid.html` | The canonical SaaS landing template |
| 3.3 | `3.3-asymmetric-split.html` | 60/40 split alternating sides |
| 3.4 | `3.4-masonry.html` | CSS columns masonry with category filter |
| 3.5 | `3.5-fullpage-scroll.html` | scroll-snap fullpage with dot nav |
| 3.6 | `3.6-sidebar-content.html` | Universal app layout: 240px sidebar + content |
| 3.7 | `3.7-magazine-columns.html` | Tri-track: vertical rail + 2-col body + sticky ToC |
| 3.8 | `3.8-diagonal-sections.html` | Angled section dividers via clip-path |
| 3.9 | `3.9-vertical-timeline.html` | Central spine with alternating events + progress fill |
| 3.10 | `3.10-z-pattern.html` | Alternating image-text rows + Z overlay toggle |
| 3.11 | `3.11-card-stack.html` | Tinder-style swipeable card stack |
| 3.12 | `3.12-magazine-cover.html` | Italic masthead + cover lines + display word |
| 3.13 | `3.13-floating-overlap.html` | Pinboard layout with tilted/overlapping elements |
| 3.14 | `3.14-split-screen.html` | 50/50 dual hero with hover-expand |

### Chapter 4 — Navigation (14 demos, 3,894 lines)

`pages/4-navigation/`

| # | File | Topic |
|---|---|---|
| 4.1 | `4.1-sticky-navbar.html` | Transparent → frosted glass on scroll |
| 4.2 | `4.2-hamburger-mobile.html` | 3-line → X + fullscreen overlay menu |
| 4.3 | `4.3-mega-menu.html` | 4-col hover dropdown with featured tile |
| 4.4 | `4.4-dot-navigation.html` | Vertical dots tracking active section |
| 4.5 | `4.5-breadcrumbs.html` | Home › Category › Subcategory + JSON-LD schema |
| 4.6 | `4.6-tab-navigation.html` | Tabs with sliding animated underline |
| 4.7 | `4.7-command-palette.html` | Cmd+K palette with fuzzy search + arrow keys |
| 4.8 | `4.8-floating-pill-nav.html` | Frosted-glass floating nav with springy marker |
| 4.9 | `4.9-pagination.html` | Truncated page numbers + animated-pill variant |
| 4.10 | `4.10-bottom-tab.html` | iOS phone-mockup bottom tab bar with badges |
| 4.11 | `4.11-stepper.html` | 4-step signup stepper with connector lines |
| 4.12 | `4.12-animated-links.html` | 6 pure-CSS link hover techniques |
| 4.13 | `4.13-footer-mega.html` | Sprawling sitemap footer with status indicator |
| 4.14 | `4.14-drawer.html` | Left nav + right cart slide-out drawer |

### Chapter 5 — Typography & Color (13 demos, 2,935 lines)

`pages/5-typography-color/`

| # | File | Topic |
|---|---|---|
| 5.1 | `5.1-type-scale.html` | Live clamp() type-scale specimen |
| 5.2 | `5.2-font-pairing.html` | Clash Display + Satoshi (Fontshare) |
| 5.3 | `5.3-60-30-10-rule.html` | Live demo of the color distribution rule |
| 5.4 | `5.4-gradient-text.html` | background-clip:text static gradient |
| 5.5 | `5.5-display-hero-type.html` | Display type as the entire design |
| 5.6 | `5.6-dark-light-toggle.html` | Scoped theme system with localStorage |
| 5.7 | `5.7-variable-fonts.html` | Recursive variable font with 4 axis sliders |
| 5.8 | `5.8-outline-text.html` | -webkit-text-stroke hollow type + variants |
| 5.9 | `5.9-marker-highlight.html` | Marker stripe + hand-drawn strike + circle |
| 5.10 | `5.10-3d-shadow-text.html` | Stacked text-shadow extrusion + variants |
| 5.11 | `5.11-animated-gradient.html` | Animated gradient sweep through text |
| 5.12 | `5.12-mix-blend-text.html` | mix-blend-mode text inverts over background |
| 5.13 | `5.13-color-palette.html` | 5-palette explorer with click-to-copy hex |

### Chapter 6 — UI Patterns (17 demos, 4,980 lines)

`pages/6-ui-patterns/`

| # | File | Topic |
|---|---|---|
| 6.1 | `6.1-hero-section.html` | Productivity-SaaS hero with badge + gradient + mockup |
| 6.2 | `6.2-pricing-table.html` | 3-tier pricing with animated annual/monthly toggle |
| 6.3 | `6.3-testimonials.html` | Dual-row infinite marquee |
| 6.4 | `6.4-accordion-faq.html` | FAQ with single-open + search filter |
| 6.5 | `6.5-modal-dialog.html` | Scale-in modal with Esc + click-outside |
| 6.6 | `6.6-card-component.html` | Blog card grid with hover-lift + clamps |
| 6.7 | `6.7-toast.html` | Stacking corner toasts with auto-dismiss bar |
| 6.8 | `6.8-skeleton-loader.html` | Shimmer placeholder with loaded-state toggle |
| 6.9 | `6.9-avatar-stack.html` | Overlapping avatars + "+N more" + tooltips |
| 6.10 | `6.10-stat-card.html` | KPI cards with delta pills + SVG sparklines |
| 6.11 | `6.11-toggle-switch.html` | 4 toggle styles (iOS / Material / icon / knurled) |
| 6.12 | `6.12-dropzone.html` | Drag-and-drop with real file events + fake upload |
| 6.13 | `6.13-data-table.html` | Sortable + filterable + bulk-action data table |
| 6.14 | `6.14-empty-state.html` | 5 variants: first-time / zero-results / inbox / error / permission |
| 6.15 | `6.15-tag-input.html` | Gmail "To:" chips + autocomplete + validation |
| 6.16 | `6.16-range-slider.html` | Single + dual-thumb with price histogram |
| 6.17 | `6.17-image-compare.html` | Before/after wipe slider with drag + arrow keys |

---

## 5. External CDN dependencies (per-page, never global)

Only loaded on the specific pages that need them:

| Library | Used by | URL |
|---|---|---|
| Lenis (smooth scroll) | `2.7-smooth-scroll-lenis.html` | `https://unpkg.com/lenis@1.1.13/dist/lenis.min.js` |
| Google Fonts: Cormorant Garamond | `1.4`, `1.11`, `2.38` | fonts.googleapis.com |
| Google Fonts: Anton + Noto Serif JP | `1.12` (Vaporwave) | fonts.googleapis.com |
| Google Fonts: Archivo Black + Space Mono | `1.13` (Memphis) | fonts.googleapis.com |
| Google Fonts: Bebas Neue | `1.7` (Y2K) | fonts.googleapis.com |
| Google Fonts: Nunito | `1.8` (Claymorphism) | fonts.googleapis.com |
| Google Fonts: Inter (full weights) | `1.14` (Swiss) | fonts.googleapis.com |
| Google Fonts: Caveat + Architects Daughter | `1.16` (Sketch) | fonts.googleapis.com |
| Google Fonts: Orbitron + VT323 | `1.10` (Cyberpunk) | fonts.googleapis.com |
| Google Fonts: Recursive (5-axis variable) | `5.7` | fonts.googleapis.com |
| Fontshare: Clash Display + Satoshi | `5.2` | api.fontshare.com |

When you add a new demo that needs a CDN library or font, add a row here.

---

## 6. The pager chain (matters when reordering or adding demos)

Within each chapter, every demo's prev/next links form a contiguous chain:

- The chapter's `index.html` has a prev/next pager to the previous/next chapter's index.
- The **first demo** of a chapter links prev to the chapter index, next to demo `N.2`.
- Each middle demo links prev to `N.M-1`, next to `N.M+1`.
- The **last demo** of a chapter links prev to `N.M-1`, next to the **next chapter's** `index.html` (or, for chapter 6, back to the root `index.html`).

When you add a demo, the previously-last demo's pager must be updated to point to your new demo instead of jumping to the next chapter.

---

## 7. Files you should never touch directly

| File | Why |
|---|---|
| (none) | Every file is fair game to edit, but follow the doc-update rules in `/CLAUDE.md`. |

---

## 8. Quick commands

```sh
# Count files
find pages -name "*.html" | wc -l            # 120 (6 indexes + 112 demos + 1 chapter index counted = 119; verify)
find . -name "*.html"      | wc -l            # 119
ls pages/2-scroll-animation/*.html | grep -v "/index.html" | wc -l   # 38

# Quick line-count by chapter
for d in pages/*/; do echo "$d $(wc -l $d*.html 2>/dev/null | tail -1)"; done

# Find a demo by topic
grep -l "stroke-dashoffset" pages/2-scroll-animation/*.html
```
