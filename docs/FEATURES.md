# FEATURES.md

> **For Claude / contributors:** This is the catalog of *what works* in the project — every demo technique plus every cross-cutting shell feature. Pair with `ARCHITECTURE.md` (the *why*) and `CODEBASE.md` (the *where*). When you add or remove a demo, or change cross-cutting behavior, update this file.

---

## Shell features (work on every page)

These are wired in `assets/js/global.js` + `assets/css/components.css`.

### 1. Dark/Light theme toggle
- Sun/moon SVG button in the navbar.
- Reads `localStorage('vibe-theme')` first; falls back to `prefers-color-scheme`.
- Defaults to **dark** if neither is set.
- Applies `data-theme="dark|light"` to `<html>` before render to prevent flash.
- Tokens swap via the `[data-theme="light"]` CSS block in `global.css`.

### 2. Sticky navbar with scroll-state
- `.nav` is `position: sticky; top: 0`.
- Adds `.scrolled` class when `window.scrollY > 24` — flips background to frosted glass.
- Holds: brand logo (with glowing accent dot), breadcrumb trail (`.nav-trail`), theme toggle.

### 3. Copy-to-clipboard for prompts
- Every demo page has a `.prompt-card` containing a `.copy-btn`.
- Click writes the inner `.prompt-body` text to clipboard via `navigator.clipboard.writeText()`.
- Falls back to `document.execCommand('copy')` on older browsers.
- Swaps button content to "Copied ✓" for 1.8s and shows a centered "Prompt copied" toast.

### 4. Toast notifications
- A single `.toast` element appended to `<body>` on demand by `showToast(msg)`.
- Slides up from bottom-center with bouncy easing, auto-dismisses after 1.8s.
- Currently used by the copy-prompt confirmation. Available for future shared use.

### 5. Demo Fullscreen Toggle ⛶
- A floating `.demo-fs` button is auto-injected into every `.demo` element by `global.js`.
- Click → `enterFullscreen(demo)`:
  1. Saves the demo's parent, next-sibling, and `window.scrollY`.
  2. Inserts a `.demo-placeholder` card in the demo's slot ("Demo is fullscreen — press Esc or Bring demo back").
  3. Moves the demo to `<body>` so it escapes any clipping ancestor.
  4. Adds `.is-fullscreen` to the demo (becomes `position: fixed; inset: 0; z-index: 9999`).
  5. Adds `.demo-fullscreen-open` to `<body>` to lock page scroll.
- Exit via the now-orange "Exit ✕" button, the Esc key, or the placeholder's "Bring demo back" button.
- A subtle "Press Esc to exit" pill appears at the bottom of the screen for 4s.

### 6. Breadcrumbs in every page header
- Built statically into every demo page's `.nav-trail` (e.g. `Home / Aesthetics / Glassmorphism`).
- Last segment has class `.here` and uses the accent color.

### 7. Prev / Next pager on every demo
- Static `<a class="prev">` / `<a class="next">` links at the bottom of every demo page.
- Chains every demo together; last-of-chapter jumps to next chapter's index.

### 8. Grain noise overlay
- Fixed full-screen SVG noise texture at 4% opacity, mix-blend-mode: overlay.
- Sits behind everything (z-index 1); subtle film-grain feel.
- Hidden behind fullscreen demos.

---

## Chapter 1 · Design Aesthetics (16 demos)

| # | Title | What the demo shows |
|---|---|---|
| 1.1 | **Glassmorphism** | Frosted-glass card row over a vivid purple→blue gradient with a glass-style navbar |
| 1.2 | **Neumorphism** | Soft-UI music player on `#e0e5ec` with dual box-shadows; buttons depress on `:active` |
| 1.3 | **Brutalism** | Thick 3px black borders, yellow accents, tilted cards, monospace, scrolling marquee |
| 1.4 | **Minimalism** | Photography portfolio in Cormorant Garamond on `#FAFAF9`, generous whitespace |
| 1.5 | **Bento Grid** | 6 cards of varying spans (2×2 big, 1×2 tall, small cards) on near-black |
| 1.6 | **Dark Luxury** | Vercel/Raycast-style hero with near-black bg, electric blue CTA glow, radial purple aura |
| 1.7 | **Retro / Y2K** | Hot pink + cyan + lime, chrome metallic title, animated sparkles, Bebas Neue display |
| 1.8 | **Claymorphism** | Inflated 3D task UI with multi-layer shadows; press animation on buttons |
| 1.9 | **Aurora / Mesh Gradient** | 4 animated color blobs with `mix-blend-mode: screen` + frosted glass cards on top |
| 1.10 | **Cyberpunk / Synthwave** | Neon vanishing-point floor grid, sunset sky, retro sun, HUD overlays in VT323 |
| 1.11 | **Editorial / Magazine** | Print-feel article: drop cap, column rules, italic folio number, paper-warm bg |
| 1.12 | **Vaporwave** | Pastel pink/cyan marble, chromatic-aberration type, Greek-bust circle, Japanese vertical text |
| 1.13 | **Memphis Design** | 80s Milan revival: terrazzo dots, zigzags, hard offset shadows, clashing color |
| 1.14 | **Swiss / International Style** | 12-column Helvetica grid with one red accent; toggle reveals the underlying grid lines |
| 1.15 | **Liquid / Goo Effect** | SVG goo filter merges neighboring color blobs and button pills into one liquid shape |
| 1.16 | **Sketch / Hand-drawn** | Excalidraw-style wobble: handwritten font, asymmetric border-radius, hand-drawn underline scribbles |

## Chapter 2 · Scroll & Animation (38 demos — the biggest chapter)

| # | Title | What the demo shows |
|---|---|---|
| 2.1 | **Parallax Scrolling** | 3 absolutely-positioned layers (sky, mountains, trees) translate at different speeds inside a scoped scroller |
| 2.2 | **Scroll-triggered animation** | IntersectionObserver fade-up with staggered transition-delay across feature cards |
| 2.3 | **Horizontal Scroll Sections** | Horizontal card track using native `scroll-snap-type: x mandatory` + progress bar |
| 2.4 | **Sticky Pinning** | Sticky phone mockup on left; right column scrolls — phone screen swaps per active feature block |
| 2.5 | **Text Reveal on Scroll** | Headline split into per-word spans with staggered fade-up + Replay button |
| 2.6 | **Scroll Progress Indicator** | Long article with a gradient progress bar that fills as you scroll inside |
| 2.7 | **Smooth Scroll (Lenis)** | Lenis library loaded from CDN with on/off toggle to compare native vs smooth |
| 2.8 | **Magnetic / Custom Cursor** | Custom dot follows cursor; grows on links; magnetic translate on the CTA |
| 2.9 | **3D Card Tilt on Hover** | rotateX/Y on mousemove + radial highlight tracking cursor + Z-axis parallax on inner elements |
| 2.10 | **Animated Number Counter** | Stats count from 0 via requestAnimationFrame ease-out-cubic when entering view |
| 2.11 | **Sticky Stacking Cards** | Cards `position: sticky` with staggered top offsets — they pile up as you scroll |
| 2.12 | **Clip-Path Image Reveal** | Image revealed by `clip-path: inset(...)` slit expanding outward + simultaneous scale-zoom |
| 2.13 | **SVG Path Drawing** | 4 paths (underline, signature, line chart, logo) draw themselves via stroke-dashoffset |
| 2.14 | **Marquee Text Banner** | 3 stacked infinite CSS-animation marquees at different sizes and directions |
| 2.15 | **Hover Image Preview** | Project list — each link shows a cursor-tracking preview image with lerp smoothing |
| 2.16 | **Page Loader / Transition** | 0→100 counter curtain that slides up to reveal staggered hero text |
| 2.17 | **Exploded Assembly** | Phone made of 5 layered slabs explodes in 3D Z-space, reassembles; callout labels fade in |
| 2.18 | **Image Sequence Scrub** | 24 generated CSS-gradient frames swap one-at-a-time tied to scroll (simulates rendered rotation) |
| 2.19 | **3D Rotate on Scroll** | Real CSS `preserve-3d` cube rotates 360° X + 720° Y as you scroll |
| 2.20 | **Cinematic Pin & Zoom** | Giant outlined "AURORA" shrinks while a glowing orb scales up from inside — then hero copy fades in |
| 2.21 | **Cross-section Reveal** | 5 tilted "building layers" separate vertically with material labels fading in row-by-row |
| 2.22 | **Section Color Morph** | Background + navbar + accent color smoothly interpolate as each section enters view |
| 2.23 | **SVG Path Follow** | Element travels along a winding cubic-Bezier curve via `path.getPointAtLength()` with 4 waypoint markers |
| 2.24 | **Globe / Planet Rotation** | CSS-built sphere with continents + grid that "rotates" via background-position-x; orbit ring of city labels |
| 2.25 | **Hand-off Transition** | One shared product element morphs between 3 scenes via CSS class swap + transition on top/left/width/height/border-radius |
| 2.26 | **Phone Screen Sync** | Phone frame pinned; inner content `translateY(-1400px × p)` so screen scrolls through 3 app views |
| 2.27 | **Liquid Morph** | Single SVG path's coordinates linearly interpolate between 4 organic blob shapes |
| 2.28 | **Card Spread** | 5-card stack fans out into a row via per-card `--target-x` custom property |
| 2.29 | **Camera Dolly Parallax** | 7 layered illustrations at different `translateZ`; stage pushes forward in Z creating true perspective parallax |
| 2.30 | **Iris / Aperture Reveal** | 6 triangular blades rotate away from center exposing the scene behind; f-stop readout |
| 2.31 | **Origami Fold** | 4 paper panels hinge open/closed in 3D from a folded crane to a flat sheet |
| 2.32 | **Particle Assembly** | Canvas2D — hundreds of particles lerp from random positions toward letter-shape targets sampled from offscreen canvas |
| 2.33 | **Clockwork Gears** | 4 interlocking gears + clock hands rotate at different speeds and directions; tempo readout |
| 2.34 | **Filmstrip Scrub** | 35mm filmstrip with 8 frames slides horizontally through a fixed projector gate with sprocket holes |
| 2.35 | **Door / Panel Open** | Two riveted vault doors slide apart in opposite directions; warm light beam spills out from the gap |
| 2.36 | **Type Shatter & Reform** | Headline split into letter spans; each letter has random 3D scatter vector — interpolate between scattered and formed |
| 2.37 | **Animated Mask Wipe** | clip-path between two full-bleed scenes with toggle for diagonal / circle / horizontal-bars shapes |
| 2.38 | **Book Open / Page Turn** | 3D book — cover swings open from spine, then a page rotates -180° revealing the next spread |

## Chapter 3 · Layouts (14 demos)

| # | Title | What the demo shows |
|---|---|---|
| 3.1 | **F-Pattern Layout** | Long-form article with sticky ToC sidebar + toggleable F-shape heatmap overlay |
| 3.2 | **Hero + Feature Grid** | Complete SaaS landing template (hero → logos → features → testimonial → CTA) |
| 3.3 | **Asymmetric Split** | 60/40 split with the second section reversed (image flips sides) |
| 3.4 | **Masonry** | Photography grid using CSS `columns: 3` with category filter buttons |
| 3.5 | **Full-Page Scroll Sections** | 5-section `scroll-snap-type: y mandatory` with vertical dot navigation |
| 3.6 | **Sidebar + Content** | 240px dark sidebar + dashboard content with stat cards + data table |
| 3.7 | **Magazine Multi-Column** | Tri-track grid: vertical-text left rail + 2-column article body + sticky right sidebar |
| 3.8 | **Diagonal / Skewed Sections** | Sections meet via `clip-path: polygon` angled cuts instead of flat edges |
| 3.9 | **Vertical Timeline** | Central spine with alternating-side events + dots that light + gradient progress fill on scroll |
| 3.10 | **Z-Pattern Layout** | Alternating image-text rows; toggleable Z-shape overlay shows the eye-flow path |
| 3.11 | **Card Stack / Swipe** | Tinder-style draggable card stack with prev/next buttons + counter |
| 3.12 | **Magazine Cover** | Italic masthead + cover lines + oversized italic display word over photographic gradient |
| 3.13 | **Floating Overlap** | Designer's pinboard: tilted gradient cards, quote card, yellow badge, giant faded numeral |
| 3.14 | **Split-Screen Hero** | 50/50 vertical split that expands on hover (`grid-template-columns: 1.6fr 1fr`) with VS badge sliding |

## Chapter 4 · Navigation (14 demos)

| # | Title | What the demo shows |
|---|---|---|
| 4.1 | **Sticky Navbar** | Transparent at top, frosted glass after 60px scroll; state readout |
| 4.2 | **Hamburger / Mobile Menu** | Animated 3-line→X icon + fullscreen overlay with staggered link fade-in |
| 4.3 | **Mega Menu** | 4-column hover dropdown on "Women" link with featured image panel |
| 4.4 | **Dot Navigation** | Vertical fixed dots; IntersectionObserver active state; hover tooltips |
| 4.5 | **Breadcrumbs** | Home › Men's Clothing › Outerwear › Winter Jackets with JSON-LD schema in `<head>` |
| 4.6 | **Tab Navigation** | 4 tabs with sliding 2px blue underline that animates between tab positions |
| 4.7 | **Command Palette (Cmd+K)** | Cmd+K opens overlay with fuzzy filter, arrow-key nav, grouped results, keyboard shortcuts |
| 4.8 | **Floating Pill Nav** | Frosted-glass nav island with animated accent-pill marker following active link |
| 4.9 | **Pagination** | Truncated page numbers (1 … 5 6 7 … 12) + a compact animated-pill variant |
| 4.10 | **Bottom Tab Bar** | iOS-style 5-tab dock inside a phone mockup with active pip and notification badge |
| 4.11 | **Stepper / Progress** | 4-step signup with done/current/future states + connector lines + body swap |
| 4.12 | **Animated Underline Links** | 6 pure-CSS hover techniques: slide / reveal / swap / marker / squiggle / arrow nudge |
| 4.13 | **Footer Mega-Menu** | Brand + newsletter + 4 link columns + status indicator + social row + legal links |
| 4.14 | **Slide-out Drawer** | Both variants: left nav drawer + right cart drawer with overlay + Esc to close |

## Chapter 5 · Typography & Color (13 demos)

| # | Title | What the demo shows |
|---|---|---|
| 5.1 | **Type Scale & Hierarchy** | Full scale specimen: display / h1 / h2 / h3 / body / small with clamp() sizes labeled |
| 5.2 | **Font Pairing** | Clash Display headings + Satoshi body, loaded from Fontshare CDN |
| 5.3 | **60-30-10 Color Rule** | Brochure-style layout demonstrating the dominant/secondary/accent distribution with a legend |
| 5.4 | **Gradient Text** | Two gradient-clipped words in a hero (purple→pink, then green→cyan) |
| 5.5 | **Display / Hero Typography** | Type-only hero: large display serif with gradient italic word |
| 5.6 | **Dark / Light Toggle** | Scoped theme system inside the demo using its own CSS custom properties + localStorage |
| 5.7 | **Variable Font Sliders** | Recursive variable font with 4 sliders: weight / slant / casual / mono — morphs live |
| 5.8 | **Outline / Stroke Text** | -webkit-text-stroke hollow type with chromatic-offset and hover-fill variants |
| 5.9 | **Marker Highlight** | Marker stripe + sweep-on-hover + hand-drawn strikethrough + hand-drawn circle annotation |
| 5.10 | **3D Layered Text Shadow** | Stacked text-shadow extrusion + long-shadow + neon-glow + embossed variants |
| 5.11 | **Animated Gradient Text** | Gradient sweeps through text via background-position animation + 3 variants |
| 5.12 | **Mix-blend Text** | Text auto-inverts against split-color background; 6 blend-mode toggle (difference / exclusion / multiply / screen / overlay / normal) |
| 5.13 | **Color Palette Explorer** | 5 curated palettes, click-to-copy hex codes, live mockup re-themes per palette |

## Chapter 6 · UI Patterns (17 demos)

| # | Title | What the demo shows |
|---|---|---|
| 6.1 | **Hero Section** | Productivity-SaaS hero: badge + gradient headline word + dual CTA + trust row + browser-chrome mockup |
| 6.2 | **Pricing Table** | 3-tier pricing with animated monthly/annual pill toggle and a highlighted "Most Popular" tier |
| 6.3 | **Testimonials Marquee** | Dual-row infinite testimonial scroll in opposite directions with edge fades |
| 6.4 | **Accordion / FAQ** | Single-open accordion with rotating + icon + live search filter |
| 6.5 | **Modal / Dialog** | Trigger button → animated scale+fade modal with sign-up form, Esc + click-outside close |
| 6.6 | **Card Component** | 3-col blog card grid with hover-lift, image aspect-ratio, line-clamped title/excerpt |
| 6.7 | **Toast Notification** | Stacking corner toasts with success/info/warn/error variants + countdown progress bar |
| 6.8 | **Skeleton Loader** | Shimmering placeholder cards with toggle between loading / loaded / auto-cycle |
| 6.9 | **Avatar Stack** | Overlapping avatar circles + "+N more" overflow + tooltips on hover; 3 sizes + online dot |
| 6.10 | **Stat / KPI Card** | Dashboard grid: label + big tabular-nums value + delta pill + SVG sparkline + 2× featured variant |
| 6.11 | **Toggle Switch** | 4 variants: iOS pill / Material square / icon-on-knob / chunky knurled |
| 6.12 | **File Upload Dropzone** | Real drag-and-drop with `event.dataTransfer.files` + colored file-type badges + fake upload progress |
| 6.13 | **Data Table** | Sortable headers + search filter + row selection + bulk-action button + pagination footer |
| 6.14 | **Empty State** | 5 variants: first-time / zero-results / inbox-zero / error / no-access with hand-drawn SVGs |
| 6.15 | **Tag / Chip Input** | Gmail "To:" with Enter-to-chip + Backspace-removes + autocomplete + email validation + color cycling |
| 6.16 | **Range Slider** | Single-value styled native range + dual-thumb price range with live histogram updates |
| 6.17 | **Image Compare Slider** | Before/after wipe with draggable handle, keyboard arrows, and preset buttons |

---

## Cross-cutting nice-to-haves currently in the codebase

- **Inline SVG icons** — all icons are inline SVG (no icon font), drawn with currentColor for theme compatibility.
- **`font-variant-numeric: tabular-nums`** — used on every number that animates (counters, stats, prices, KPIs) to prevent digit-width jitter.
- **`will-change`** — applied on heavily-animated transforms (particle canvas, exploded layers, mask wipes) for GPU hinting.
- **`prefers-reduced-motion`** — *not yet honored.* This is a known gap; would be a good follow-up to add `@media (prefers-reduced-motion: reduce)` overrides in demos with continuous animation.
- **Keyboard support** — Esc closes modals (6.5) and fullscreen demos; arrow keys nudge image-compare handle (6.17) and command-palette selection (4.7); Cmd/Ctrl+K opens command palette globally on its demo page.

---

## Known limitations / future work

1. **`prefers-reduced-motion` not yet wired** across the heavy animation demos.
2. **Demo CSS is inlined** in each page's `<style>` — duplication when a technique is reused. Intentional (keeps each page self-contained as a copy-paste recipe), but a future refactor could extract truly identical blocks.
3. **No production search** for the catalog. Vocab terms are static on the root index; a fuzzy search across all 112 demos would be a great add.
4. **Mobile review** — most demos work down to 480px but the scroll-tied 3D ones (exploded, dolly, gears) feel cramped at phone widths. Acceptable for a reference site but worth a polish pass.
5. **Theme toggle inside demos** — the global theme toggle only affects the shell; individual demos can override with their own bg/fg and don't always honor light mode. Some demos (e.g. 5.6) ship their own scoped toggle for the actual demo content.
