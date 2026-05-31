# Plan 01 — Chrome De-duplication Refactor

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the ~3,900 lines of copy-pasted navbar + footer HTML spread across all 119 HTML files so that any future chrome change requires editing exactly one place — not 119 files.

---

## The Problem — By The Numbers

| Repeated block | Lines per file | × 119 files | Duplicated lines |
|---|---|---|---|
| `<header class="nav">…</header>` | ~25 | 119 | ~2,975 |
| `<footer class="foot">…</footer>` | ~6 | 119 | ~714 |
| `<div class="grain">` | 1 | 119 | 119 |
| **Total** | **~32** | | **~3,808** |

The nav block alone contains two 20-line inline SVG blobs (GitHub + YouTube icons) and the full theme-toggle button. Adding a single nav icon just required a 119-file bulk-replace — the exact problem this plan solves.

**Three page depth levels exist**, each with slightly different relative paths:

| Level | Example | Asset prefix | Root link |
|---|---|---|---|
| Root | `index.html` | `assets/…` | `index.html` |
| Chapter index | `pages/1-aesthetics/index.html` | `../../assets/…` | `../../index.html` |
| Demo page | `pages/1-aesthetics/1.1-glass.html` | `../../assets/…` | `../../index.html` |

---

## Part 1 — Full Build-Tooling Landscape

Eight realistic options. Each is evaluated on four axes: **complexity**, **file:// support** (can you open HTML directly without a server), **GitHub Pages hosting**, and **scaling headroom**.

---

### Option A — JS Injection (no build, extend `global.js`)

**How it works:** SVG constants and nav/footer HTML templates defined once inside the existing `global.js` IIFE. `buildNav()` reads a `data-trail` attribute on the `<header>` stub and constructs the full navbar at runtime. `buildFooter()` does the same. This is exactly what `global.js` already does for the fullscreen button on every `.demo`.

Each HTML file shrinks to:
```html
<header class="nav" data-trail="Aesthetics|Glassmorphism"></header>
…page content…
<footer class="foot"></footer>
```

| Dimension | Rating |
|---|---|
| Setup effort | ✅ Minimal — extend one existing file |
| Works on `file://` | ✅ Yes — no fetch, no server |
| GitHub Pages | ✅ Serve directly from repo root or `/docs` branch, zero config |
| Adds dependencies | ✅ None |
| View Source shows nav | ❌ No — stub only; rendered by JS |
| SEO / crawlability | ⚠️ Nav not in static HTML (fine for a reference site, bad for a product site) |
| Future: add search | ⚠️ Possible but awkward — needs a client-side index |
| Future: add CMS | ❌ Content still lives in raw HTML files |
| Future: add tags/filters | ❌ No data model |
| Future: auto-generate pagers | ❌ Pager chain still manually maintained |

**Best for:** Fixing the immediate problem today with zero new infrastructure. Recommended if you don't plan to scale to a CMS or site-wide search.

---

### Option B — Web Components (`<vibe-nav>`, `<vibe-footer>`)

**How it works:** Define custom elements in a new `assets/js/chrome.js`. HTML files use `<vibe-nav trail="Aesthetics|Glassmorphism"></vibe-nav>`.

| Dimension | Rating |
|---|---|
| Setup effort | ✅ Low — ~60 lines of JS per component |
| Works on `file://` | ✅ Yes |
| GitHub Pages | ✅ Direct serve |
| Adds dependencies | ✅ None |
| View Source shows nav | ❌ No |
| Future scaling | ⚠️ Same ceiling as Option A |

**Verdict:** Marginally more idiomatic than Option A but no practical advantage at this project's scale. The extra `<script>` tag in every file is the only real tradeoff. Skip unless you specifically want the Custom Elements API pattern.

---

### Option C — `fetch()`-based HTML Partials

**How it works:** `assets/partials/nav.html` + `assets/partials/footer.html`. `global.js` fetches and injects them.

| Dimension | Rating |
|---|---|
| Works on `file://` | ❌ **Blocked.** `fetch()` is CORS-restricted on `file://` |
| GitHub Pages | ✅ Would work on HTTP |

**Verdict: Disqualified.** Breaks the project's core guarantee of opening directly from the filesystem.

---

### Option D-Node — Custom Node.js Build Script (minimal, zero npm deps)

**How it works:** A `build.js` script reads `src/**/*.html` template files containing `<!-- CHROME:NAV trail="Aesthetics|Glassmorphism" -->` and `<!-- CHROME:FOOTER -->` placeholders. It replaces those comments with the actual shared HTML partials from `src/_partials/nav.html` and `src/_partials/footer.html`, then writes the output to `dist/`. The `dist/` folder is what gets served / committed.

```
src/
  _partials/
    nav.html          ← single source of truth for the nav
    footer.html       ← single source of truth for the footer
  index.html          ← has <!-- CHROME:NAV --> placeholder
  pages/
    1-aesthetics/
      1.1-glassmorphism.html   ← same placeholder
dist/                 ← generated output (gitignore or commit for GH Pages)
build.js              ← ~80 lines of vanilla Node.js fs + string replace
```

| Dimension | Rating |
|---|---|
| Setup effort | ✅ Low — ~80 lines, no npm install |
| Works on `file://` | ✅ Yes — `dist/` files are fully rendered HTML |
| GitHub Pages | ✅ Commit `dist/` to `gh-pages` branch, or use Actions to build on push |
| View Source shows nav | ✅ Yes — output is full HTML |
| Adds dependencies | ✅ None (Node.js only, no npm) |
| Future: add search | ⚠️ Build script can generate a `search-index.json`, but search UI still manual |
| Future: add CMS | ❌ Content still in HTML files |
| Future: auto-generate pagers | ⚠️ Possible but you'd be hand-rolling it |
| Future: add tags/filters | ❌ No data model |

**Best for:** Teams that want full HTML in the output and hate npm, but are willing to run `node build.js` before opening files. The natural stepping stone before an SSG.

---

### Option D-PostHTML — PostHTML Preprocessor

**How it works:** PostHTML is PostCSS for HTML. The `posthtml-include` plugin lets you write `<include src="partials/nav.html">` directly in HTML files. One `npm run build` compiles everything to `dist/`.

```
npm install --save-dev posthtml posthtml-cli posthtml-include
```

`package.json`:
```json
{
  "scripts": {
    "build": "posthtml src/**/*.html --output dist --use posthtml-include",
    "watch": "posthtml src/**/*.html --output dist --use posthtml-include --watch"
  }
}
```

| Dimension | Rating |
|---|---|
| Setup effort | ✅ Low — 1 config, familiar HTML syntax |
| Works on `file://` | ✅ Yes — output is rendered HTML |
| GitHub Pages | ✅ Actions or commit `dist/` |
| npm required | ⚠️ Yes — 2 packages |
| Future: add data model | ❌ Not without adding more plugins |
| Future scaling | ⚠️ Same ceiling as D-Node; you'd migrate to an SSG later anyway |

**Best for:** Devs who prefer keeping logic out of JS and want HTML-in-HTML syntax (`<include>`). Good bridge before committing to a full SSG.

---

### Option D-11ty — Eleventy SSG ⭐ Recommended for scaling

**How it works:** Eleventy (11ty) is a minimal JavaScript SSG. You write templates in Nunjucks (which looks almost identical to HTML), define shared layouts once, and feed page-specific data (trail, title, chapter) through frontmatter. The output is plain HTML files, no JS runtime in the output.

```
npm install --save-dev @11ty/eleventy
```

Directory structure after migration:
```
src/
  _includes/
    base.njk             ← the universal page shell (nav, footer, grain, CSS links)
    demo.njk             ← extends base, adds demo-page-specific sections
    chapter.njk          ← extends base, chapter index layout
  _data/
    chapters.json        ← { "1": { name: "Aesthetics", demos: [...] } }
  index.njk              ← root catalog page
  pages/
    1-aesthetics/
      index.njk          ← chapter index (frontmatter: chapter: 1)
      1.1-glassmorphism.njk  ← demo (frontmatter: trail, prev, next, chapter)
dist/                    ← generated output
.eleventy.js             ← minimal config (~20 lines)
```

Frontmatter on a demo page:
```yaml
---
title: Glassmorphism
trail: ["Aesthetics", "Glassmorphism"]
chapter: 1
prev: "../index.html"
next: "1.2-neumorphism.html"
layout: demo.njk
---
```

| Dimension | Rating |
|---|---|
| Setup effort | ⚠️ Medium — migrate 119 files to `.njk`, write 3 layout templates |
| Works on `file://` | ✅ Yes — output is full HTML |
| GitHub Pages | ✅ GitHub Actions (see GH Pages section below) |
| npm required | ⚠️ Yes — 1 package |
| View Source shows nav | ✅ Yes |
| Future: demo count growth | ✅ Collections auto-sort, pager auto-generates |
| Future: add search | ✅ Generate `search-index.json` from collections at build time |
| Future: add CMS (Decap/Netlify) | ✅ Frontmatter = CMS fields, works natively |
| Future: add tags/filters | ✅ 11ty collections support arbitrary frontmatter filtering |
| Future: auto-generate pagers | ✅ `collections.demo` sorted by slug, prev/next from index |
| Future: i18n | ✅ Supported |
| Future: Markdown demos | ✅ Nunjucks + Markdown together |
| Learning curve | ⚠️ Nunjucks template syntax (gentle) |

**Best for:** Long-term growth. 11ty is the SSG that requires the least departure from vanilla HTML/CSS/JS — Nunjucks files look almost identical to HTML. The `dist/` output is completely plain HTML, no framework runtime.

---

### Option D-Jekyll — Jekyll SSG (GitHub Pages Native)

**How it works:** Jekyll is the only SSG that GitHub Pages runs natively — push to `main`, Pages runs Jekyll for you, no Actions required. Uses Liquid templating. Demo pages become Markdown or HTML with YAML frontmatter inside `_layouts/`.

```
gem install bundler jekyll
```

| Dimension | Rating |
|---|---|
| Setup effort | ⚠️ Medium — Ruby install, Gemfile, `_config.yml`, migrate to Liquid templates |
| Works on `file://` | ❌ No — requires `jekyll serve` or GitHub Pages |
| GitHub Pages | ✅✅ **Native** — push and it builds automatically, zero Actions config |
| npm required | ✅ No — Ruby only |
| Future: add search | ✅ `jekyll-search` plugin or build-time JSON index |
| Future: add CMS | ✅ Decap CMS works natively with Jekyll |
| Future: auto-pager | ✅ `jekyll-paginate` |
| Ruby required | ⚠️ Yes — non-trivial setup on some systems |
| Liquid vs Nunjucks | ⚠️ Liquid syntax is less powerful than Nunjucks |
| Local dev without server | ❌ Must run `jekyll serve` |

**Best for:** Teams that specifically want zero GitHub Actions config and are OK with a Ruby dependency. The `file://` loss is a real regression from the current experience.

---

### Option D-Hugo — Hugo SSG (no npm, no Ruby)

**How it works:** Hugo is a single Go binary — download it, it works. Extremely fast builds (milliseconds for 119 pages). Uses Go's `html/template` syntax.

| Dimension | Rating |
|---|---|
| Setup effort | ⚠️ Medium — Go template syntax is distinct from HTML |
| Works on `file://` | ❌ No — requires `hugo server` or static output |
| GitHub Pages | ✅ GitHub Actions (1 official Action: `peaceiris/actions-hugo`) |
| npm required | ✅ None |
| Build speed | ✅✅ Sub-second for 119 pages |
| Future scaling | ✅ Excellent — content types, taxonomies, shortcodes |
| Go template syntax | ⚠️ Steeper learning curve than Nunjucks/Liquid |
| Future: add CMS | ✅ Decap CMS works with Hugo |

**Best for:** Teams that want the fastest possible builds, no npm, and plan significant content growth. The Go template syntax is the main barrier.

---

### Option D-Astro — Astro Framework

**How it works:** Astro components (`.astro` files) look like HTML with a frontmatter code block. Zero JS in output by default — you opt in to interactive islands. Can import React/Vue/Svelte components selectively.

| Dimension | Rating |
|---|---|
| Setup effort | ⚠️ Higher — new file format, larger ecosystem to learn |
| Works on `file://` | ❌ No — `astro build` outputs to `dist/`, needs server for dev |
| GitHub Pages | ✅ Official Astro GitHub Pages guide |
| npm required | ⚠️ Yes — larger install than 11ty |
| Future: add React components | ✅✅ Best of any option |
| Future: add CMS | ✅ Content collections + Decap CMS |
| Future: add search | ✅ `@astrojs/starlight` has search built in |
| Overkill for current site? | ⚠️ Probably yes — this site is HTML/CSS/JS, not component-driven |

**Best for:** If you want to eventually add React/Vue interactive demo components. For a purely static reference site, 11ty or Hugo is a better fit.

---

### Option D-Vite / Parcel — Module Bundlers

Both Vite and Parcel can process multi-page HTML apps, inlining JS/CSS and resolving imports. They solve bundling, not templating — you'd still need a separate solution for shared HTML partials (e.g., via Vite plugins).

| Dimension | Rating |
|---|---|
| Shared HTML partials | ⚠️ Needs plugin (e.g., `vite-plugin-html`) |
| Works on `file://` | ❌ No — dev server required |
| Best for | JS-heavy SPAs, not static HTML reference sites |

**Verdict:** Wrong tool for this job. The project's value is in CSS/HTML demos, not JS bundling. Skip unless the project pivots to a heavily JS-driven architecture.

---

## Part 2 — GitHub Pages Hosting Matrix

GitHub Pages can serve your site in three ways:

| Method | How | Build required | Config |
|---|---|---|---|
| **Direct from branch** | Serve `main` root or `/docs` folder | No | Settings → Pages → Branch |
| **`gh-pages` branch** | Pre-built `dist/` committed to `gh-pages` | Yes (local or CI) | Settings → Pages → Branch `gh-pages` |
| **GitHub Actions artifact** | Actions builds → uploads Pages artifact | Yes (Actions) | Settings → Pages → Actions source |

### Which option uses which GH Pages method

| Option | GH Pages method | Actions needed | `file://` still works |
|---|---|---|---|
| A — JS Injection | Direct from `main` ✅ | ❌ No | ✅ Yes |
| B — Web Components | Direct from `main` ✅ | ❌ No | ✅ Yes |
| D-Node — Custom script | Commit `dist/` to `gh-pages`, or Actions | Optional | ✅ Yes (`dist/`) |
| D-PostHTML | Actions → artifact | ✅ Yes | ✅ Yes (`dist/`) |
| D-11ty | Actions → artifact | ✅ Yes | ✅ Yes (`dist/`) |
| D-Jekyll | **Native** — Pages runs Jekyll ✅ | ❌ No | ❌ No (needs server) |
| D-Hugo | Actions → artifact | ✅ Yes | ❌ No |
| D-Astro | Actions → artifact | ✅ Yes | ❌ No |

### GitHub Actions workflow for 11ty (copy-paste ready)

If you choose 11ty, this is the complete `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build          # eleventy --output=dist
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### GitHub Actions workflow for Hugo

```yaml
name: Deploy Hugo to GitHub Pages
on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: latest
          extended: true
      - run: hugo --minify --destination dist
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

---

## Part 3 — Scaling Analysis

What does "scaling" mean for this project, and how does each option perform against each dimension?

### Scaling dimensions

| Dimension | What it means |
|---|---|
| **Demo growth** | Going from 112 → 300+ entries without the pager chain becoming unmanageable |
| **Search** | Full-text search across all 112 demo titles, techniques, and prompt text |
| **Content model** | Structuring demo data (title, chapter, tags, prompt, examples) separately from presentation HTML |
| **Tags & filtering** | "Show me all CSS-only scroll demos" or "all demos that use GSAP" |
| **Contributor workflow** | External contributors adding demos via PR without touching pager chains or count numbers in 4 places |
| **Versioning** | Tagging prompts for specific Claude/AI model versions ("updated for Claude 4") |
| **CMS integration** | Non-developers editing demo copy, prompts, or example site lists via a GUI (Decap CMS, Sanity, etc.) |
| **Performance** | Image optimisation, CSS purging, asset fingerprinting |
| **Analytics** | Tracking which demos get viewed most |

### Scaling scorecard

| Dimension | A: JS Injection | D-Node | D-11ty | D-Jekyll | D-Hugo | D-Astro |
|---|---|---|---|---|---|---|
| Demo growth (pager auto-gen) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Search (build-time index) | ❌ | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| Content model (frontmatter/data) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Tags & filtering | ❌ | ❌ | ✅ | ⚠️ | ✅ | ✅ |
| Contributor workflow | ❌ hard | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| Prompt versioning | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| CMS integration | ❌ | ❌ | ✅ Decap | ✅ Decap | ✅ Decap | ✅ |
| Performance (asset pipeline) | ❌ | ❌ | ⚠️ | ⚠️ | ✅ | ✅ |
| Works on `file://` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GH Pages (no Actions) | ✅ | ⚠️ | ❌ | ✅✅ | ❌ | ❌ |
| Zero new dependencies | ✅ | ✅ | ❌ | ❌ Ruby | ❌ | ❌ |
| Migration effort (from current) | Low | Low | Medium | High | High | High |

### Key tradeoff: `file://` vs. full SSG

The current project's killer feature is "open `index.html` in any browser, no server, no install." Every full SSG breaks this — you get the same ease of access back only for the *served* version (local `npx eleventy --serve`, or GitHub Pages), not the raw filesystem.

**If `file://` is non-negotiable:** Stay with Option A forever, accept scaling limits.

**If you're willing to trade `file://` for growth:** 11ty is the natural next step. Local dev becomes `npx @11ty/eleventy --serve` (one command, no global install needed). The `dist/` output is still plain HTML files you can open individually if needed.

---

## Part 4 — Decision Matrix

Use this to pick your option before choosing an implementation plan.

```
Do you want to keep the "open index.html directly" guarantee?
│
├─ YES ──── Do you want full scaling (search, CMS, auto-pager)?
│           │
│           ├─ YES ──── No good option exists. Choose the LEAST bad:
│           │           → Accept the tradeoff and go with 11ty (Option D-11ty)
│           │             The dist/ files technically still open on file://.
│           │
│           └─ NO ───── Option A (JS Injection) ← DO THIS NOW
│                       Fixes the immediate problem. No new tools.
│
└─ NO ───── Do you want GitHub Pages with zero GitHub Actions config?
            │
            ├─ YES ──── Option D-Jekyll (native GH Pages support)
            │           Tradeoff: Ruby dependency, no file:// support.
            │
            └─ NO ───── Do you want to avoid npm entirely?
                        │
                        ├─ YES ──── Option D-Hugo (Go binary, no npm)
                        │
                        └─ NO ───── How much do you plan to scale?
                                    │
                                    ├─ Just includes + minor things ──── Option D-PostHTML
                                    │
                                    ├─ Full CMS/search/collections ───── Option D-11ty ⭐
                                    │
                                    └─ React components eventually ───── Option D-Astro
```

### Recommended migration path (if unsure)

```
Today:    Option A (JS Injection)     → zero friction, fixes the immediate problem
6 months: Option D-11ty               → if the demo count grows past 150 or
                                        you want search / contributor CMS
```

The two options are **not in conflict** — Option A is a valid first step and 11ty can consume the `data-trail` attribute convention as frontmatter when you migrate. The `strip_chrome.py` migration script in Option A's tasks serves double duty: it's also the first step in an 11ty migration (stripping the old repeated HTML before the SSG takes over).

---

## Part 5 — Implementation Plans

Two full task plans are provided. Choose the one matching your decision above.

---

## Implementation Plan A — JS Injection (no build, fixes today)

**Architecture:** Extend the existing `global.js` IIFE to build and inject the full navbar + footer from constants. HTML files carry only a stub with a `data-trail` attribute. A one-off Python migration script handles the bulk strip across all 119 files.

**Tech Stack:** Vanilla JS, Python 3 (one-off migration, deleted after use).

---

### A · The `data-trail` Encoding

| Page type | `data-trail` value | Rendered breadcrumb |
|---|---|---|
| Root `index.html` | *(absent)* | `Home` (amber, no link) |
| Chapter index | `"Aesthetics"` | `Home / Aesthetics` (current) |
| Demo page | `"Aesthetics\|Glassmorphism"` | `Home / Aesthetics / Glassmorphism` (current) |

Root vs. subpage depth detected via `window.location.pathname.includes('/pages/')` — works on both `file://` and `http://`.

---

### A · Task 1 — Write the migration Python script

**File:** `strip_chrome.py` (repo root, temporary — deleted in Task A.7)

- [ ] **A.1.1 — Create `strip_chrome.py`:**

```python
#!/usr/bin/env python3
"""
strip_chrome.py — One-off migration: strips repeated nav/footer HTML from
all 119 HTML files and replaces them with minimal data-attribute stubs.

Run from repo root:  python3 strip_chrome.py
Safe to re-run (idempotent). Delete this script after migration is verified.
"""
import re
from pathlib import Path


def extract_trail(header_html: str) -> str:
    """
    Parse the nav-trail div from old full-nav HTML.
    Returns pipe-delimited breadcrumb labels (excluding 'Home').

    '<span class="here">Home</span>'               → ''
    '<a>Home</a>…<span class="here">Aesthetics</span>'    → 'Aesthetics'
    '<a>Home</a>…<a>Aesthetics</a>…<span class="here">Glassmorphism</span>'
                                                   → 'Aesthetics|Glassmorphism'
    """
    trail_match = re.search(
        r'<div class="nav-trail">(.*?)</div>', header_html, re.DOTALL
    )
    if not trail_match:
        return ''
    labels = re.findall(
        r'<(?:a|span)[^>]*>([^<]+)</(?:a|span)>', trail_match.group(1)
    )
    return '|'.join(
        l.strip() for l in labels if l.strip() not in ('Home', '/')
    )


def strip_nav(content: str) -> str:
    match = re.search(r'<header class="nav">(.*?)</header>', content, re.DOTALL)
    if not match:
        return content  # already stripped
    trail = extract_trail(match.group(1))
    attr = f' data-trail="{trail}"' if trail else ''
    return re.sub(
        r'<header class="nav">.*?</header>',
        f'<header class="nav"{attr}></header>',
        content, flags=re.DOTALL,
    )


def strip_footer(content: str) -> str:
    return re.sub(
        r'<footer class="foot">.*?</footer>',
        '<footer class="foot"></footer>',
        content, flags=re.DOTALL,
    )


def process_file(path: Path) -> bool:
    original = path.read_text(encoding='utf-8')
    updated = strip_footer(strip_nav(original))
    if updated == original:
        return False
    path.write_text(updated, encoding='utf-8')
    return True


if __name__ == '__main__':
    files = [p for p in Path('.').rglob('*.html') if '.git' not in p.parts]
    changed = sum(1 for f in sorted(files) if process_file(f))
    print(f'Done. {changed}/{len(files)} files updated.')
```

- [ ] **A.1.2 — Dry-run to verify extraction on three page types:**

```bash
python3 -c "
import re, strip_chrome
from pathlib import Path

tests = [
    ('index.html',                                       ''),
    ('pages/1-aesthetics/index.html',                    'Aesthetics'),
    ('pages/1-aesthetics/1.1-glassmorphism.html',        'Aesthetics|Glassmorphism'),
    ('pages/6-ui-patterns/6.17-image-compare.html',     'UI Patterns|Image Compare Slider'),
]
for path, expected in tests:
    c = Path(path).read_text()
    m = re.search(r'<header class=\"nav\">(.*?)</header>', c, re.DOTALL)
    got = strip_chrome.extract_trail(m.group(1)) if m else '(no match)'
    status = '✓' if got == expected else '✗'
    print(f'{status} {path}')
    if got != expected:
        print(f'  Expected: {repr(expected)}')
        print(f'  Got:      {repr(got)}')
"
```

Expected: all four lines show `✓`.

---

### A · Task 2 — Extend `global.js` with `buildNav()` and `buildFooter()`

**File:** `assets/js/global.js`

- [ ] **A.2.1 — Add SVG constants** at the very top of the IIFE, before `/* ---------- Theme ---------- */`:

```js
/* ---------- Chrome SVGs (single source of truth) ---------- */
const GH_SVG   = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z"/></svg>';
const YT_SVG   = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/></svg>';
const MOON_SVG = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>';
const SUN_SVG  = '<svg class="sun"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
```

- [ ] **A.2.2 — Add `buildNav()` + `buildFooter()`** inside the `ready()` callback, as the very first calls before `/* Navbar scroll state */`:

```js
/* ---------- Build Nav ---------- */
function buildNav() {
  const header = document.querySelector('header.nav');
  if (!header || header.querySelector('.nav-inner')) return; // already built

  const isSubpage = window.location.pathname.includes('/pages/');
  const rootHref  = isSubpage ? '../../index.html' : 'index.html';

  // data-trail="Chapter|Demo"  (pipe-separated, 0–2 parts, no 'Home')
  const parts = (header.getAttribute('data-trail') || '').trim().split('|').filter(Boolean);

  const trailHTML =
    parts.length === 0
      ? '<span class="here">Home</span>'
    : parts.length === 1
      ? `<a href="${rootHref}">Home</a><span class="sep">/</span><span class="here">${parts[0]}</span>`
      : `<a href="${rootHref}">Home</a><span class="sep">/</span><a href="index.html">${parts[0]}</a><span class="sep">/</span><span class="here">${parts[1]}</span>`;

  header.innerHTML = `
    <div class="nav-inner">
      <a href="${rootHref}" class="nav-logo"><span class="dot"></span>Vibe Design Reference<small>v1</small></a>
      <div class="nav-trail">${trailHTML}</div>
      <div class="nav-actions">
        <a href="https://github.com/skystone1000/Web-Design-Prompts"
           target="_blank" rel="noopener" class="nav-icon-btn" aria-label="GitHub repository">${GH_SVG}</a>
        <a href="https://www.youtube.com/@skystone1000"
           target="_blank" rel="noopener" class="nav-icon-btn yt" aria-label="YouTube channel">${YT_SVG}</a>
        <div class="nav-divider" aria-hidden="true"></div>
        <button class="theme-toggle" aria-label="Toggle theme">${MOON_SVG}${SUN_SVG}</button>
      </div>
    </div>`;
}
buildNav();

/* ---------- Build Footer ---------- */
function buildFooter() {
  const footer = document.querySelector('footer.foot');
  if (!footer || footer.querySelector('.foot-inner')) return; // already built

  const isSubpage = window.location.pathname.includes('/pages/');
  const rootHref  = isSubpage ? '../../index.html' : 'index.html';

  footer.innerHTML = `
    <div class="foot-inner">
      <div>© Vibe Design Reference · built from The Vibe Coder's Web Design Guide</div>
      <div><a href="${rootHref}">↑ Home</a></div>
    </div>`;
}
buildFooter();
```

- [ ] **A.2.3 — Confirm execution order** is correct inside `ready()`. The theme-toggle listener queries `.theme-toggle` after `buildNav()` injects it:

```
ready(() => {
  buildNav();         ← injects .theme-toggle
  buildFooter();
  /* Navbar scroll state */
  /* Theme toggle */  ← document.querySelector('.theme-toggle') finds injected button ✓
  /* Copy-prompt */
  /* Demo fullscreen */
});
```

No change needed to the toggle listener — just confirm the order.

---

### A · Task 3 — Manual smoke-test on one file

- [ ] **A.3.1 — Manually strip ONE file** to test the JS before the bulk run:

  In `pages/1-aesthetics/1.1-glassmorphism.html`, replace lines ~120–144 with:
  ```html
  <header class="nav" data-trail="Aesthetics|Glassmorphism"></header>
  ```
  And replace the `<footer class="foot">…</footer>` block with:
  ```html
  <footer class="foot"></footer>
  ```

- [ ] **A.3.2 — Open in browser** (`open pages/1-aesthetics/1.1-glassmorphism.html`) and confirm:
  - [ ] Navbar renders completely (logo, trail, GitHub, YouTube, theme toggle)
  - [ ] Trail reads: `Home / Aesthetics / Glassmorphism` — "Glassmorphism" in amber
  - [ ] "Aesthetics" links to `index.html` (chapter index); "Home" links to `../../index.html`
  - [ ] Theme toggle, copy-prompt, and fullscreen still work

- [ ] **A.3.3 — Browser console assertion:**

```js
const issues = [];
if (!document.querySelector('.nav-inner'))           issues.push('nav-inner missing');
if (!document.querySelector('.nav-trail .here'))     issues.push('trail .here missing');
if (document.querySelector('.nav-trail .here').textContent.trim() !== 'Glassmorphism')
                                                     issues.push('wrong current label');
if (document.querySelectorAll('.nav-icon-btn').length !== 2)
                                                     issues.push('wrong icon count');
if (!document.querySelector('.foot-inner'))          issues.push('foot-inner missing');
issues.length ? console.error(issues) : console.log('✓ All checks passed');
```

Expected: `✓ All checks passed`

- [ ] **A.3.4 — Revert the test file:**

```bash
git checkout pages/1-aesthetics/1.1-glassmorphism.html
```

---

### A · Task 4 — Run the migration on all 119 files

- [ ] **A.4.1 — Commit `global.js` changes first:**

```bash
git add assets/js/global.js
git commit -m "feat: add buildNav() and buildFooter() chrome injection to global.js"
```

- [ ] **A.4.2 — Run the migration:**

```bash
python3 strip_chrome.py
# Expected: Done. 119/119 files updated.
```

- [ ] **A.4.3 — Verify correctness on spot-check files:**

```bash
grep 'data-trail' index.html
# Expected: (no output — root has no trail)

grep 'data-trail' pages/1-aesthetics/index.html
# Expected: <header class="nav" data-trail="Aesthetics"></header>

grep 'data-trail' pages/2-scroll-animation/2.1-parallax.html
# Expected: <header class="nav" data-trail="Scroll &amp; Animation|Parallax Scrolling"></header>
```

- [ ] **A.4.4 — Verify zero old chrome remains in any HTML file:**

```bash
grep -r 'nav-icon-btn' --include='*.html' . | wc -l
# Expected: 0

grep -r 'foot-inner'   --include='*.html' . | wc -l
# Expected: 0

grep -r 'nav-inner'    --include='*.html' . | wc -l
# Expected: 0
```

---

### A · Task 5 — Visual verification (three page types)

- [ ] **A.5.1** — `open index.html` → trail = `Home` only (amber), footer links to `index.html`
- [ ] **A.5.2** — `open pages/3-layouts/index.html` → trail = `Home / Layouts`, logo → `../../index.html`
- [ ] **A.5.3** — `open pages/6-ui-patterns/6.13-data-table.html` → trail = `Home / UI Patterns / Data Table`, fullscreen + copy-prompt still work
- [ ] **A.5.4** — Toggle to light mode on root, navigate to a demo, confirm theme persists

---

### A · Task 6 — Update docs

- [ ] **A.6.1 — `docs/ARCHITECTURE.md` §4** — update demo template stub lines:
  - `<header class="nav">…</header>` → `<header class="nav" data-trail="Chapter|Demo"></header>  <!-- JS-built by buildNav() in global.js -->`
  - `<footer class="foot">…</footer>` → `<footer class="foot"></footer>  <!-- JS-built by buildFooter() in global.js -->`

- [ ] **A.6.2 — `docs/ARCHITECTURE.md` §5** — add two items to the global.js list after item 7:
  ```
  8. **Build nav** — buildNav() reads data-trail, constructs full nav HTML (logo, trail,
     GitHub/YouTube icons, theme toggle) and sets header.innerHTML. Depth detection via
     window.location.pathname.includes('/pages/').
  9. **Build footer** — buildFooter() constructs footer HTML with correct root link.
  ```

- [ ] **A.6.3 — `docs/CODEBASE.md`** — update global.js "Six concerns" note to "Nine concerns" and add items 8–9.

---

### A · Task 7 — Clean up and final commit

- [ ] **A.7.1 — Delete migration script:**

```bash
rm strip_chrome.py
```

- [ ] **A.7.2 — Final commit:**

```bash
git add -A
git commit -m "refactor: singularise nav+footer — JS injection replaces ~3,800 lines of duplicated HTML

Any future chrome change now requires editing exactly 1 file (global.js)."
```

- [ ] **A.7.3 — Confirm file count unchanged:**

```bash
find . -name '*.html' ! -path './.git/*' | wc -l
# Expected: 119
```

---

## Implementation Plan D-11ty — Eleventy SSG (scale path)

**Architecture:** Migrate all 119 HTML files to Nunjucks `.njk` templates. One base layout (`_includes/base.njk`) holds the nav, footer, and grain. Page-specific data (trail, title, chapter, prev, next) moves to YAML frontmatter. 11ty builds the `dist/` directory. Pager links are auto-generated from sorted collections. A `search-index.json` is generated at build time for future search.

**Tech Stack:** Node.js 20+, `@11ty/eleventy` (one npm dependency), GitHub Actions for deployment.

**Migration effort:** ~2–3 days. The `strip_chrome.py` from Plan A is reused as step one.

---

### D-11ty · New file structure

```
src/
  _includes/
    base.njk               ← universal shell: <html>, <head>, nav, footer, grain
    demo.njk               ← extends base; adds entry-hero, entry-section, pager
    chapter.njk            ← extends base; adds cat-hero, cat-grid
  _data/
    site.json              ← { "title": "Vibe Design Reference", "github": "…", "youtube": "…" }
    chapters.json          ← chapter metadata: id, name, slug, color
  index.njk                ← root catalog (extends base.njk)
  pages/
    1-aesthetics/
      index.njk            ← chapter index (layout: chapter.njk; frontmatter: chapter id)
      1.1-glassmorphism.njk   ← demo (layout: demo.njk; full frontmatter below)
      …
dist/                      ← 11ty output (gitignored or deployed via Actions)
.eleventy.js               ← config (~30 lines)
package.json
```

### D-11ty · Demo page frontmatter

```yaml
---
layout: demo.njk
title: Glassmorphism
chapter: 1
chapterName: Aesthetics
slug: "1.1"
prev: "../index.html"
next: "1.2-neumorphism.html"
tags:
  - aesthetics
  - css-only
  - background
promptUpdated: "2025-01"
---
```

### D-11ty · Task 1 — Install and configure Eleventy

- [ ] **D.1.1 — Initialise npm and install 11ty:**

```bash
npm init -y
npm install --save-dev @11ty/eleventy
```

- [ ] **D.1.2 — Create `.eleventy.js`** at repo root:

```js
module.exports = function (eleventyConfig) {
  // Pass through static assets unchanged
  eleventyConfig.addPassthroughCopy('src/assets');

  // Demo collection: all pages in pages/*/*.njk sorted by slug
  eleventyConfig.addCollection('demos', (api) =>
    api.getFilteredByGlob('src/pages/*/*.njk')
       .filter(p => p.data.slug)
       .sort((a, b) => a.data.slug.localeCompare(b.data.slug, undefined, { numeric: true }))
  );

  // Chapter collection
  eleventyConfig.addCollection('chapters', (api) =>
    api.getFilteredByGlob('src/pages/*/index.njk')
       .sort((a, b) => (a.data.chapter || 0) - (b.data.chapter || 0))
  );

  // Generate search index as a JSON file
  eleventyConfig.addCollection('searchIndex', (api) => {
    const demos = api.getFilteredByGlob('src/pages/*/*.njk').filter(p => p.data.slug);
    return demos.map(p => ({
      title:   p.data.title,
      chapter: p.data.chapterName,
      tags:    p.data.tags || [],
      url:     p.url,
    }));
  });

  return {
    dir: { input: 'src', output: 'dist' },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
```

- [ ] **D.1.3 — Add scripts to `package.json`:**

```json
{
  "scripts": {
    "build": "eleventy",
    "dev":   "eleventy --serve --port 8080"
  }
}
```

- [ ] **D.1.4 — Add `dist/` and `node_modules/` to `.gitignore`:**

```bash
echo "dist/" >> .gitignore
echo "node_modules/" >> .gitignore
```

- [ ] **D.1.5 — Verify 11ty runs on an empty src:**

```bash
mkdir -p src
npm run build
# Expected: output in dist/, no errors
```

---

### D-11ty · Task 2 — Create the base layout

- [ ] **D.2.1 — Create `src/_includes/base.njk`:**

```html
<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{{ title }} — Vibe Design Reference</title>
  <meta name="description" content="{{ description or 'A living reference catalog of web-design techniques.' }}" />
  <link rel="stylesheet" href="/assets/css/global.css" />
  <link rel="stylesheet" href="/assets/css/components.css" />
  {% block head %}{% endblock %}
  {% block styles %}{% endblock %}
</head>
<body>
  <div class="grain" aria-hidden="true"></div>

  <header class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo"><span class="dot"></span>Vibe Design Reference<small>v1</small></a>
      <div class="nav-trail">
        {% if trail and trail.length %}
          <a href="/">Home</a>
          {% for crumb in trail %}
            <span class="sep">/</span>
            {% if loop.last %}
              <span class="here">{{ crumb.label }}</span>
            {% else %}
              <a href="{{ crumb.href }}">{{ crumb.label }}</a>
            {% endif %}
          {% endfor %}
        {% else %}
          <span class="here">Home</span>
        {% endif %}
      </div>
      <div class="nav-actions">
        <a href="{{ site.github }}" target="_blank" rel="noopener"
           class="nav-icon-btn" aria-label="GitHub repository">{{ ghSvg | safe }}</a>
        <a href="{{ site.youtube }}" target="_blank" rel="noopener"
           class="nav-icon-btn yt" aria-label="YouTube channel">{{ ytSvg | safe }}</a>
        <div class="nav-divider" aria-hidden="true"></div>
        <button class="theme-toggle" aria-label="Toggle theme">{{ moonSvg | safe }}{{ sunSvg | safe }}</button>
      </div>
    </div>
  </header>

  {% block content %}{% endblock %}

  <footer class="foot">
    <div class="foot-inner">
      <div>© Vibe Design Reference · built from The Vibe Coder's Web Design Guide</div>
      <div><a href="/">↑ Home</a></div>
    </div>
  </footer>

  {% block scripts %}{% endblock %}
  <script src="/assets/js/global.js"></script>
</body>
</html>
```

Note: `{{ ghSvg | safe }}` etc. come from `src/_data/svgs.js` (created in next step) — this keeps SVG blobs out of the template entirely.

- [ ] **D.2.2 — Create `src/_data/svgs.js`** (SVG strings as data, out of templates):

```js
module.exports = {
  ghSvg:   '<svg viewBox="0 0 24 24" fill="currentColor">…</svg>',   // paste full GitHub SVG
  ytSvg:   '<svg viewBox="0 0 24 24" fill="currentColor">…</svg>',   // paste full YouTube SVG
  moonSvg: '<svg class="moon" …>…</svg>',
  sunSvg:  '<svg class="sun" …>…</svg>',
};
```

- [ ] **D.2.3 — Create `src/_data/site.json`:**

```json
{
  "title": "Vibe Design Reference",
  "github": "https://github.com/skystone1000/Web-Design-Prompts",
  "youtube": "https://www.youtube.com/@skystone1000"
}
```

---

### D-11ty · Task 3 — Migrate HTML files

- [ ] **D.3.1 — Copy `src/` structure from existing HTML files.** The fastest path is to:
  1. Copy all existing `*.html` to `src/` preserving directory structure
  2. Rename `.html` → `.njk`
  3. Add frontmatter block at the top of each file
  4. Replace the `<header>…</header>` block with `{% extends "base.njk" %}{% block content %}`
  5. Add `{% endblock %}` before `</body>`

  A Python script handles this in bulk:

```python
#!/usr/bin/env python3
"""
migrate_to_11ty.py — Copies HTML files to src/, adds minimal frontmatter,
wraps content in Nunjucks extends block.
Run: python3 migrate_to_11ty.py
"""
import re, shutil
from pathlib import Path

CHAPTERS = {
    '1': ('Aesthetics',        'aesthetics'),
    '2': ('Scroll & Animation','scroll-animation'),
    '3': ('Layouts',           'layouts'),
    '4': ('Navigation',        'navigation'),
    '5': ('Typography & Color','typography-color'),
    '6': ('UI Patterns',       'ui-patterns'),
}

def get_title(content):
    m = re.search(r'<title>(.*?)(?:\s*[—–-].*)?</title>', content)
    return m.group(1).strip() if m else 'Untitled'

def get_slug(filename):
    m = re.match(r'(\d+\.\d+)-', filename)
    return m.group(1) if m else None

def strip_chrome(content):
    content = re.sub(r'<header class="nav">.*?</header>', '', content, flags=re.DOTALL)
    content = re.sub(r'<footer class="foot">.*?</footer>', '', content, flags=re.DOTALL)
    content = re.sub(r'<div class="grain"[^>]*></div>', '', content)
    content = re.sub(r'<script src="[^"]*global\.js"></script>', '', content)
    content = re.sub(r'<!doctype html>.*?<body>', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'</body>\s*</html>', '', content, flags=re.DOTALL | re.IGNORECASE)
    return content.strip()

for html in sorted(Path('.').rglob('*.html')):
    if '.git' in html.parts or 'dist' in html.parts or 'src' in html.parts:
        continue
    dest = Path('src') / html.with_suffix('.njk')
    dest.parent.mkdir(parents=True, exist_ok=True)

    content = html.read_text(encoding='utf-8')
    slug = get_slug(html.name)
    ch_id = html.parts[1].split('-')[0] if 'pages' in html.parts else None
    ch_name, _ = CHAPTERS.get(ch_id, ('', '')) if ch_id else ('', '')

    frontmatter = f'---\nlayout: base.njk\ntitle: {get_title(content)}\n'
    if slug:     frontmatter += f'slug: "{slug}"\n'
    if ch_name:  frontmatter += f'chapter: {ch_id}\nchapterName: {ch_name}\n'
    frontmatter += '---\n\n'

    body = strip_chrome(content)
    dest.write_text(frontmatter + body, encoding='utf-8')
    print(f'  migrated  {html} → {dest}')

print('Migration complete. Review frontmatter and update layouts.')
```

- [ ] **D.3.2 — Manually complete frontmatter** for all demo pages: add `prev:`, `next:`, and `tags:` fields. (This step is the human editorial work — no script can reliably infer prev/next.)

- [ ] **D.3.3 — Run build and fix template errors:**

```bash
npm run build
# Fix any Nunjucks syntax errors reported
```

---

### D-11ty · Task 4 — Set up GitHub Actions deployment

- [ ] **D.4.1 — Create `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

- [ ] **D.4.2 — Enable GitHub Pages in repo Settings → Pages → Source: GitHub Actions.**

- [ ] **D.4.3 — Push to `main` and confirm deployment:**

```bash
git add -A
git commit -m "feat: migrate to 11ty SSG — shared layouts, frontmatter, GH Actions deploy"
git push origin main
# Watch Actions tab — should see build + deploy succeed
# Confirm site live at https://skystone1000.github.io/Web-Design-Prompts/
```

---

## Summary — Which Plan to Execute

| If you want… | Run |
|---|---|
| Fix the immediate 119-file problem, zero new tools, keep `file://` | **Plan A** |
| Fix the same problem AND set up for search, CMS, auto-pager, growth | **Plan D-11ty** |
| Native GitHub Pages (no Actions) and okay with Ruby + no `file://` | **Plan D-Jekyll** (tasks not written — follow jekyllrb.com quickstart) |
| No npm/Ruby ever, fast builds, okay with Go templates | **Plan D-Hugo** (tasks not written — follow gohugo.io quickstart) |

**Recommended sequencing if unsure:**
1. Execute Plan A this week — it fixes the immediate pain, takes ~2 hours.
2. Revisit in 3–6 months when demo count or contributor demand justifies the SSG migration.
3. Plan A and Plan D-11ty are **not in conflict** — the `strip_chrome.py` migration script in Plan A is also the first step in a future 11ty migration.
