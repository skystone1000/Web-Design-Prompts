/* Global behaviors: navbar scroll, theme toggle, copy-to-clipboard, toast */
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
  });
})();
