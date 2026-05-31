<!-- VIBE DESIGN REFERENCE — README -->

<div align="center">

```
██╗   ██╗██╗██████╗ ███████╗    ██████╗ ███████╗███████╗██╗ ██████╗ ███╗   ██╗
██║   ██║██║██╔══██╗██╔════╝    ██╔══██╗██╔════╝██╔════╝██║██╔════╝ ████╗  ██║
██║   ██║██║██████╔╝█████╗      ██║  ██║█████╗  ███████╗██║██║  ███╗██╔██╗ ██║
╚██╗ ██╔╝██║██╔══██╗██╔══╝      ██║  ██║██╔══╝  ╚════██║██║██║   ██║██║╚██╗██║
 ╚████╔╝ ██║██████╔╝███████╗    ██████╔╝███████╗███████║██║╚██████╔╝██║ ╚████║
  ╚═══╝  ╚═╝╚═════╝ ╚══════╝    ╚═════╝ ╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝

       R  E  F  E  R  E  N  C  E
```

### *A living catalog of 112 web-design techniques — explained, demoed live, and ready to paste into any AI builder.*

<br/>

[![HTML](https://img.shields.io/badge/HTML-Static-E8B339?style=flat-square&logo=html5&logoColor=E8B339)](.)
[![CSS](https://img.shields.io/badge/CSS-Vanilla-D96F5A?style=flat-square&logo=css3&logoColor=D96F5A)](.)
[![JS](https://img.shields.io/badge/JS-No%20Framework-6FB5A8?style=flat-square&logo=javascript&logoColor=6FB5A8)](.)
[![Demos](https://img.shields.io/badge/Live%20Demos-112-E8B339?style=flat-square)](.)
[![Build](https://img.shields.io/badge/Build%20Step-None-success?style=flat-square)](.)
[![License](https://img.shields.io/badge/License-MIT-white?style=flat-square)](.)

<br/>

> **Open `index.html` in any browser. That's it. No install, no server, no build.**

</div>

---

## What Is This?

**Vibe Design Reference** is a self-contained reference catalog for web designers and AI-assisted builders. Every entry gives you:

| | What you get |
|:---:|---|
| 📖 | **Plain-English explanation** of the technique — what it is and how it works |
| ▶️ | **Live interactive demo** — running in the browser, fullscreen-capable |
| 📋 | **Copy-paste AI prompt** — the exact prompt that produces the effect in Claude, v0, Cursor, Lovable, Framer AI, etc. |
| 🔗 | **Real-world examples** — production sites to study |

112 techniques across 6 chapters. Zero dependencies. Open directly from the filesystem.

---

## Quick Start

```sh
# 1. Clone the repo
git clone https://github.com/your-username/Web-Design-Prompts.git

# 2. Open in your browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

> **That's the entire setup.** There is no `npm install`, no `npm run dev`, no build step.  
> The site works on `file://` — open `index.html` and explore.

---

## The Six Chapters

Each chapter is a standalone section with its own overview page and a grid of demo cards.

<details>
<summary><strong>Chapter 1 · Design Aesthetics</strong> — 16 demos &nbsp;→&nbsp; <code>pages/1-aesthetics/</code></summary>

<br/>

| # | Technique | What it looks like |
|---|---|---|
| 1.1 | **Glassmorphism** | Frosted-glass cards over a vivid violet→blue gradient |
| 1.2 | **Neumorphism** | Soft-UI music player on warm grey with inset box-shadows |
| 1.3 | **Brutalism** | Thick black borders, yellow accents, rotated type |
| 1.4 | **Minimalism** | Photography portfolio in Cormorant Garamond, generous whitespace |
| 1.5 | **Bento Grid** | Mixed-size feature cards on near-black |
| 1.6 | **Dark Luxury** | Vercel/Raycast-style hero with electric blue glow |
| 1.7 | **Retro / Y2K** | Hot pink + cyan + lime, chrome metallic display type |
| 1.8 | **Claymorphism** | Inflated 3D task UI with multi-layer shadows |
| 1.9 | **Aurora / Mesh Gradient** | 4 animated color blobs with `mix-blend-mode: screen` |
| 1.10 | **Cyberpunk / Synthwave** | Neon vanishing-point floor grid + sunset sky |
| 1.11 | **Editorial / Magazine** | Drop cap, column rules, paper-warm feel |
| 1.12 | **Vaporwave** | Pastel marble, Greek busts, Japanese vertical text |
| 1.13 | **Memphis Design** | 80s Milan: terrazzo, zigzags, hard offset shadows |
| 1.14 | **Swiss / International Style** | 12-col Helvetica grid with one red accent |
| 1.15 | **Liquid / Goo Effect** | SVG goo filter merging neighboring color blobs |
| 1.16 | **Sketch / Hand-drawn** | Excalidraw-style wobble with handwritten fonts |

</details>

<details>
<summary><strong>Chapter 2 · Scroll &amp; Animation</strong> — 38 demos &nbsp;→&nbsp; <code>pages/2-scroll-animation/</code></summary>

<br/>

> The largest chapter. Most demos use a **scoped scroll container** (`overflow-y: scroll` on the `.demo` div) so they don't interfere with page scroll. All support the fullscreen toggle.

| # | Technique | Core mechanism |
|---|---|---|
| 2.1 | **Parallax Scrolling** | 3 layers translate at different speeds |
| 2.2 | **Scroll-triggered Fade** | IntersectionObserver + staggered transition-delay |
| 2.3 | **Horizontal Scroll** | `scroll-snap-type: x mandatory` + progress bar |
| 2.4 | **Sticky Pinning** | Phone mockup pinned; right column scrolls |
| 2.5 | **Text Reveal** | Per-word spans with staggered fade-up |
| 2.6 | **Scroll Progress Bar** | Gradient fill bar tied to read percentage |
| 2.7 | **Smooth Scroll (Lenis)** | Lenis CDN with on/off toggle |
| 2.8 | **Magnetic Cursor** | Custom dot + magnetic translate on CTA |
| 2.9 | **3D Card Tilt** | `rotateX/Y` on mousemove + radial highlight |
| 2.10 | **Animated Counters** | `requestAnimationFrame` ease-out-cubic from 0 |
| 2.11 | **Sticky Stacking Cards** | `position: sticky` pile-up on scroll |
| 2.12 | **Clip-path Reveal** | `clip-path: inset()` slit + zoom |
| 2.13 | **SVG Path Drawing** | `stroke-dashoffset` animation on 4 paths |
| 2.14 | **Marquee Banner** | Triple infinite CSS-animation bands |
| 2.15 | **Hover Image Preview** | Cursor-tracking preview with lerp smoothing |
| 2.16 | **Page Loader** | 0→100 curtain with staggered hero reveal |
| 2.17 | **Exploded Assembly** | Phone slabs explode in 3D Z-space |
| 2.18 | **Image Sequence Scrub** | 24 CSS-gradient frames swap on scroll |
| 2.19 | **3D Rotate on Scroll** | `preserve-3d` cube 360°X + 720°Y |
| 2.20 | **Cinematic Pin & Zoom** | Outlined word shrinks while orb grows |
| 2.21 | **Cross-section Reveal** | Tilted building layers separate vertically |
| 2.22 | **Section Color Morph** | Page palette smoothly interpolates per section |
| 2.23 | **SVG Path Follow** | Element travels `path.getPointAtLength()` |
| 2.24 | **Globe Rotation** | CSS sphere with `background-position-x` drift |
| 2.25 | **Hand-off Transition** | One element morphs between 3 scenes |
| 2.26 | **Phone Screen Sync** | Inner content `translateY` synced to scroll |
| 2.27 | **Liquid Morph** | SVG path interpolates between 4 blob shapes |
| 2.28 | **Card Spread** | 5-card stack fans into a row |
| 2.29 | **Camera Dolly Parallax** | 7 layers push forward in perspective Z |
| 2.30 | **Iris / Aperture** | 6 triangular blades rotate to expose scene |
| 2.31 | **Origami Fold** | 4 panels hinge in 3D from folded to flat |
| 2.32 | **Particle Assembly** | Canvas2D sparks lerp into letter shapes |
| 2.33 | **Clockwork Gears** | 4 interlocking gears + clock hands |
| 2.34 | **Filmstrip Scrub** | 35mm strip slides through a projector gate |
| 2.35 | **Door / Panel Open** | Vault doors slide apart with light spill |
| 2.36 | **Type Shatter & Reform** | Letters scatter in 3D then reform on scroll |
| 2.37 | **Animated Mask Wipe** | `clip-path` wipe: diagonal / circle / bars |
| 2.38 | **Book Open / Page Turn** | 3D book cover swings, page rotates |

</details>

<details>
<summary><strong>Chapter 3 · Layouts</strong> — 14 demos &nbsp;→&nbsp; <code>pages/3-layouts/</code></summary>

<br/>

| # | Technique | Pattern |
|---|---|---|
| 3.1 | **F-Pattern Layout** | Sticky ToC + toggleable F-shape heatmap |
| 3.2 | **Hero + Feature Grid** | Complete SaaS landing template |
| 3.3 | **Asymmetric Split** | 60/40 alternating image-text |
| 3.4 | **Masonry Grid** | CSS `columns: 3` with category filter |
| 3.5 | **Full-Page Sections** | `scroll-snap-type: y mandatory` + dot nav |
| 3.6 | **Sidebar + Content** | 240px dark sidebar + dashboard content |
| 3.7 | **Magazine Multi-Column** | Vertical rail + 2-col body + sticky ToC |
| 3.8 | **Diagonal Sections** | `clip-path: polygon` angled dividers |
| 3.9 | **Vertical Timeline** | Central spine with alternating events |
| 3.10 | **Z-Pattern Layout** | Alternating rows + Z-overlay toggle |
| 3.11 | **Card Stack / Swipe** | Tinder-style draggable deck |
| 3.12 | **Magazine Cover** | Italic masthead + oversized display type |
| 3.13 | **Floating Overlap** | Pinboard with tilted, overlapping cards |
| 3.14 | **Split-Screen Hero** | 50/50 split that expands on hover |

</details>

<details>
<summary><strong>Chapter 4 · Navigation</strong> — 14 demos &nbsp;→&nbsp; <code>pages/4-navigation/</code></summary>

<br/>

| # | Technique | Details |
|---|---|---|
| 4.1 | **Sticky Navbar** | Transparent → frosted glass on scroll |
| 4.2 | **Hamburger Menu** | 3-line→X + fullscreen overlay with stagger |
| 4.3 | **Mega Menu** | 4-col hover dropdown + featured panel |
| 4.4 | **Dot Navigation** | Fixed vertical dots with IntersectionObserver |
| 4.5 | **Breadcrumbs** | With JSON-LD structured data in `<head>` |
| 4.6 | **Tab Navigation** | Sliding animated underline |
| 4.7 | **Command Palette** | Cmd+K fuzzy search + arrow keys + groups |
| 4.8 | **Floating Pill Nav** | Frosted glass island with animated marker |
| 4.9 | **Pagination** | Truncated numbers + animated pill variant |
| 4.10 | **Bottom Tab Bar** | iOS phone mockup with badges |
| 4.11 | **Stepper / Progress** | 4-step with connector lines + body swap |
| 4.12 | **Animated Links** | 6 pure-CSS hover techniques |
| 4.13 | **Footer Mega-Menu** | Full sitemap + newsletter + status indicator |
| 4.14 | **Slide-out Drawer** | Left nav + right cart with overlay |

</details>

<details>
<summary><strong>Chapter 5 · Typography &amp; Color</strong> — 13 demos &nbsp;→&nbsp; <code>pages/5-typography-color/</code></summary>

<br/>

| # | Technique | Demonstrates |
|---|---|---|
| 5.1 | **Type Scale** | Full specimen with `clamp()` sizes |
| 5.2 | **Font Pairing** | Clash Display + Satoshi from Fontshare |
| 5.3 | **60-30-10 Color Rule** | Live distribution demo with legend |
| 5.4 | **Gradient Text** | `background-clip: text` with static gradient |
| 5.5 | **Display Hero Type** | Type as the entire design system |
| 5.6 | **Dark / Light Toggle** | Scoped theme with localStorage |
| 5.7 | **Variable Font Sliders** | Recursive: weight / slant / casual / mono axes |
| 5.8 | **Outline / Stroke Text** | `-webkit-text-stroke` with hover-fill variants |
| 5.9 | **Marker Highlight** | Stripe + sweep + hand-drawn circle |
| 5.10 | **3D Layered Text Shadow** | Extrusion + long-shadow + neon glow |
| 5.11 | **Animated Gradient Text** | Gradient sweeps through text |
| 5.12 | **Mix-blend Text** | Auto-inverts over split-color background |
| 5.13 | **Color Palette Explorer** | 5 palettes, click-to-copy hex, live mockup |

</details>

<details>
<summary><strong>Chapter 6 · UI Patterns</strong> — 17 demos &nbsp;→&nbsp; <code>pages/6-ui-patterns/</code></summary>

<br/>

| # | Component | What's interactive |
|---|---|---|
| 6.1 | **Hero Section** | Badge + gradient headline + CTA + mockup |
| 6.2 | **Pricing Table** | Monthly/annual toggle with animated pill |
| 6.3 | **Testimonials Marquee** | Dual-row infinite scroll, opposite directions |
| 6.4 | **Accordion / FAQ** | Single-open + live search filter |
| 6.5 | **Modal / Dialog** | Scale-in, Esc + click-outside close |
| 6.6 | **Card Component** | Hover-lift, aspect-ratio, line-clamp |
| 6.7 | **Toast Notifications** | Stacking variants + countdown progress bar |
| 6.8 | **Skeleton Loader** | Shimmer placeholder with toggle |
| 6.9 | **Avatar Stack** | Overlap + "+N more" + tooltips |
| 6.10 | **Stat / KPI Card** | Delta pills + SVG sparklines |
| 6.11 | **Toggle Switch** | iOS / Material / icon / knurled variants |
| 6.12 | **File Upload Dropzone** | Real drag-and-drop + fake upload progress |
| 6.13 | **Data Table** | Sort + filter + row select + bulk action |
| 6.14 | **Empty State** | 5 variants: first-time / error / inbox-zero… |
| 6.15 | **Tag / Chip Input** | Gmail "To:" with autocomplete + validation |
| 6.16 | **Range Slider** | Single + dual-thumb with live histogram |
| 6.17 | **Image Compare Slider** | Before/after wipe + keyboard arrows |

</details>

---

## Shell Features (Available on Every Page)

These work site-wide and are wired by just three files: `assets/css/global.css`, `assets/css/components.css`, and `assets/js/global.js`.

```
┌─────────────────────────────────────────────────────────────────────┐
│  ☀/🌙  Theme toggle — dark/light, persisted to localStorage         │
│  ⬆     Sticky navbar — transparent → frosted glass on scroll        │
│  📋    Copy prompt — one click copies any AI prompt to clipboard     │
│  💬    Toast notification — confirms copy + available for your use   │
│  ⛶     Fullscreen toggle — every demo can go edge-to-edge           │
│  ›     Breadcrumbs — always know where you are in the catalog        │
│  ←→    Prev / Next pager — chain through all 112 demos               │
│  ▒     Grain overlay — subtle film-grain texture on every page       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## File Structure at a Glance

```
Web-Design-Prompts/
│
├── index.html                  ← Start here — the root catalog page
│
├── assets/
│   ├── css/
│   │   ├── global.css          ← Design tokens, reset, typography primitives
│   │   └── components.css      ← Navbar, prompt-card, pager, fullscreen
│   └── js/
│       └── global.js           ← Theme, toast, copy, fullscreen — all in one IIFE
│
├── pages/
│   ├── 1-aesthetics/           ← Chapter 1 (16 demos)
│   ├── 2-scroll-animation/     ← Chapter 2 (38 demos — the biggest)
│   ├── 3-layouts/              ← Chapter 3 (14 demos)
│   ├── 4-navigation/           ← Chapter 4 (14 demos)
│   ├── 5-typography-color/     ← Chapter 5 (13 demos)
│   └── 6-ui-patterns/          ← Chapter 6 (17 demos)
│
└── docs/
    ├── ARCHITECTURE.md         ← The mental model — read this first
    ├── CODEBASE.md             ← File-by-file map with line counts
    ├── FEATURES.md             ← Full catalog of all 112 demos
    └── MASTER_PROMPT.md        ← The original "build the site" spec
```

**Total:** 119 HTML files · 2 CSS files · 1 JS file · ~30,400 lines · 0 dependencies

---

## Design System

The shell uses a consistent **dark-luxury editorial** aesthetic. Individual demos can be anything — that's the point.

| Token | Dark | Light | Used for |
|---|---|---|---|
| `--bg` | `#0E0E12` | `#F6F2E9` | Page background |
| `--bg-elev` | `#16161C` | `#FFFFFF` | Elevated surfaces |
| `--bg-card` | `#1B1B23` | `#FFFFFF` | Cards |
| `--text` | `#F2EFE7` | `#1A1814` | Body copy |
| `--accent` | `#E8B339` | `#B8851D` | Amber — primary accent |
| `--accent-2` | `#D96F5A` | — | Sienna coral — secondary |
| `--accent-3` | `#6FB5A8` | — | Muted teal — tertiary |
| `--font-display` | `Fraunces` | same | All headlines |
| `--font-body` | `Inter Tight` | same | Body + UI copy |
| `--font-mono` | `JetBrains Mono` | same | Code blocks + badges |

---

## Adding a New Demo

The project has a strict convention that keeps every page consistent and the docs in sync. Refer to [`docs/ARCHITECTURE.md §9`](docs/ARCHITECTURE.md) for the full checklist, but here's the short version:

```
1. Create  pages/N-cat/N.M-slug.html  using the universal template
2. Scope all demo CSS under a unique class prefix (.my-demo)
3. Wire the pager: update the previously-last demo's "next" link
4. Update  pages/N-cat/index.html  — bump count + add card
5. Update  index.html  — bump 4 different entry counts
6. Update  docs/FEATURES.md  — add a row to the chapter table
7. Update  docs/CODEBASE.md  — add a file row + bump line counts
```

**Non-negotiables:**
- No build step · No frameworks · No image assets · Vanilla HTML/CSS/JS only
- Every demo's CSS lives in its own `<style>` block — no extraction to shared files
- The pager chain must be contiguous — don't leave a dead link

---

## How Scroll Demos Work

Most of Chapter 2 uses a **scoped scroll container** pattern so demos don't hijack the page's own scroll:

```
.demo { height: 720px; overflow-y: scroll; }   /* bounded scroll container */
  └─ tall div (1800–2800px)                      /* provides scroll distance */
       └─ position: sticky; top: 0              /* pin element */
            └─ CSS animated by var(--p)         /* 0→1 progress drives all visuals */
```

The JS side is just **one variable update**:

```js
scroller.addEventListener('scroll', () => {
  const p = /* normalized 0→1 from getBoundingClientRect */;
  pin.style.setProperty('--p', p);
});
```

All animation math lives in `calc()` expressions in CSS. The fullscreen toggle works seamlessly with this pattern.

---

## Tech Choices Explained

| Decision | Reason |
|---|---|
| **Static HTML, one file per demo** | Copy-pasteable, zero abstraction tax, works offline |
| **No framework** | Every page is self-contained — open it, copy it, done |
| **No build step** | `open index.html` *is* the dev experience |
| **CDN libs per-page only** | GSAP / Lenis / SplitType never loaded where they're not needed |
| **No image assets** | All visuals are CSS gradients, SVG, or unicode — repo stays light |
| **Inline demo `<style>`** | Intentional duplication so each page works as a standalone recipe |

---

## Contributing

Pull requests welcome for:
- **New demo techniques** — follow the checklist above exactly
- **Doc corrections** — keep the three docs (`ARCHITECTURE`, `CODEBASE`, `FEATURES`) in sync with any code change
- **Accessibility** — adding `prefers-reduced-motion` support to heavy animation demos is a known gap

When in doubt, read [`CLAUDE.md`](CLAUDE.md) — it's the authoritative rules file for this project.

---

## Docs Quick Reference

| Document | What it answers |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | *How does the project work?* — mental model, template, theming, scroll pattern, fullscreen system |
| [`docs/CODEBASE.md`](docs/CODEBASE.md) | *What file does what?* — every file, line counts, pager chain rules, CDN table |
| [`docs/FEATURES.md`](docs/FEATURES.md) | *What's inside?* — full catalog of all 112 demos + 8 shell features |
| [`docs/MASTER_PROMPT.md`](docs/MASTER_PROMPT.md) | *Where did this come from?* — the original "build the whole site" prompt |

---

<div align="center">

```
  ✦  112 demos  ·  6 chapters  ·  0 dependencies  ✦
```

*Open `index.html`. Learn. Copy. Build.*

</div>
