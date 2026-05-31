/* Global behaviors: navbar scroll, theme toggle, copy-to-clipboard, toast, demo fullscreen */
(function () {
  'use strict';

  /* ---------- Theme ---------- */
  const storedTheme = localStorage.getItem('vibe-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = storedTheme || (prefersDark ? 'dark' : 'dark'); // default dark for the shell
  document.documentElement.setAttribute('data-theme', initial);

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('vibe-theme', t); } catch (e) {}
  }

  /* ---------- Toast ---------- */
  let toastEl;
  function ensureToast() {
    if (toastEl) return toastEl;
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    document.body.appendChild(toastEl);
    return toastEl;
  }
  function showToast(msg) {
    const el = ensureToast();
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  /* ---------- DOM Ready ---------- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    /* Navbar scroll state */
    const nav = document.querySelector('.nav');
    if (nav) {
      const onScroll = () => {
        if (window.scrollY > 24) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Theme toggle */
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(cur === 'dark' ? 'light' : 'dark');
      });
    }

    /* Copy-prompt buttons */
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const targetSel = btn.getAttribute('data-target');
        const target = targetSel ? document.querySelector(targetSel) : btn.closest('.prompt-card')?.querySelector('.prompt-body');
        if (!target) return;
        const text = target.textContent.trim();
        try {
          await navigator.clipboard.writeText(text);
        } catch (e) {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        btn.classList.add('copied');
        const original = btn.dataset.original || btn.innerHTML;
        btn.dataset.original = original;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied';
        showToast('Prompt copied');
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = original;
        }, 1800);
      });
    });

    /* ---------- Demo Fullscreen Toggle ---------- */
    /* Inject a "Fullscreen" button into every .demo element on the page. */
    const FS_ENTER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 9 4 4 9 4"/><polyline points="20 9 20 4 15 4"/><polyline points="20 15 20 20 15 20"/><polyline points="4 15 4 20 9 20"/></svg>';
    const FS_EXIT_SVG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 4 4 4 4 9"/><polyline points="15 4 20 4 20 9"/><polyline points="15 20 20 20 20 15"/><polyline points="9 20 4 20 4 15"/></svg>';

    function makeFsButton(label) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'demo-fs';
      btn.setAttribute('aria-label', label);
      btn.innerHTML = FS_ENTER_SVG + '<span class="text">Fullscreen</span>';
      return btn;
    }

    document.querySelectorAll('.demo').forEach((demo) => {
      if (demo.querySelector(':scope > .demo-fs')) return;
      demo.appendChild(makeFsButton('Enter fullscreen'));
    });

    function ensureHint() {
      let hint = document.querySelector('.demo-fs-hint');
      if (hint) return hint;
      hint = document.createElement('div');
      hint.className = 'demo-fs-hint';
      hint.innerHTML = 'Press <kbd>Esc</kbd> to exit fullscreen';
      document.body.appendChild(hint);
      return hint;
    }

    let activeDemo = null;
    let activePlaceholder = null;
    let savedScrollY = 0;
    let savedNextSibling = null;
    let savedParent = null;

    function enterFullscreen(demo) {
      if (activeDemo) return;
      // Remember where the demo lived so we can put it back exactly
      savedParent = demo.parentNode;
      savedNextSibling = demo.nextSibling;
      savedScrollY = window.scrollY;

      // Build a placeholder card to keep page layout stable
      const ph = document.createElement('div');
      ph.className = 'demo-placeholder';
      ph.innerHTML = `
        <div>
          <span class="ic">⛶</span>
          <b>Demo is fullscreen</b><br>
          Press <kbd>Esc</kbd> · click <b>Exit</b> · or use the button below
          <br>
          <button type="button" class="return-btn">↩ Bring demo back here</button>
        </div>
      `;
      savedParent.insertBefore(ph, demo);
      activePlaceholder = ph;
      ph.querySelector('.return-btn').addEventListener('click', exitFullscreen);

      // Move the demo to body so position:fixed escapes any clipping ancestor
      document.body.appendChild(demo);
      demo.classList.add('is-fullscreen');
      document.body.classList.add('demo-fullscreen-open');
      activeDemo = demo;

      // Update the button to "Exit ✕"
      const btn = demo.querySelector(':scope > .demo-fs');
      if (btn) {
        btn.setAttribute('aria-label', 'Exit fullscreen');
        btn.innerHTML = FS_EXIT_SVG + '<span class="text">Exit ✕</span>';
      }

      // Show the keyboard hint pill (auto-fades via CSS animation)
      const hint = ensureHint();
      // restart animation
      hint.style.animation = 'none';
      void hint.offsetWidth;
      hint.style.animation = '';
    }

    function exitFullscreen() {
      if (!activeDemo) return;
      const demo = activeDemo;
      const ph = activePlaceholder;
      activeDemo = null;
      activePlaceholder = null;

      demo.classList.remove('is-fullscreen');
      document.body.classList.remove('demo-fullscreen-open');

      // Put demo back exactly where it was
      if (savedParent) {
        if (savedNextSibling && savedNextSibling.parentNode === savedParent) {
          savedParent.insertBefore(demo, savedNextSibling);
        } else {
          savedParent.appendChild(demo);
        }
      }
      if (ph && ph.parentNode) ph.parentNode.removeChild(ph);

      // Restore button label
      const btn = demo.querySelector(':scope > .demo-fs');
      if (btn) {
        btn.setAttribute('aria-label', 'Enter fullscreen');
        btn.innerHTML = FS_ENTER_SVG + '<span class="text">Fullscreen</span>';
      }

      // Restore page scroll position
      window.scrollTo({ top: savedScrollY, behavior: 'instant' in window ? 'instant' : 'auto' });
    }

    // Delegated click handler for the toggle (works even after enter/exit moves the button around)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.demo-fs');
      if (!btn) return;
      const demo = btn.closest('.demo');
      if (!demo) return;
      if (demo.classList.contains('is-fullscreen')) exitFullscreen();
      else enterFullscreen(demo);
    });

    // Esc closes fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeDemo) {
        e.preventDefault();
        exitFullscreen();
      }
    });
  });
})();
