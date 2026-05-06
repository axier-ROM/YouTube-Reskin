/* content.js — Gemini Theme for YouTube */
/* Handles dynamic elements that CSS alone can't reach */

(function () {
  'use strict';

  // ── Inject SVG gradient defs for icon recoloring ──
  function injectGradientDefs() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;overflow:hidden;width:0;height:0;';
    svg.innerHTML = `
      <defs>
        <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="#4285f4"/>
          <stop offset="50%"  stop-color="#8a6cff"/>
          <stop offset="100%" stop-color="#e040fb"/>
        </linearGradient>
      </defs>
    `;
    document.body?.prepend(svg);
  }

  // ── Inject the ambient star canvas behind content ──
  function injectStarfield() {
    if (document.getElementById('gem-starfield')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'gem-starfield';
    canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: -1;
      opacity: 0.35;
    `;
    document.body?.prepend(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const STAR_COUNT = 120;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame;
    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed * 1000 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 190, 255, ${a})`;
        ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);

    window.addEventListener('resize', () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // ── Apply gradient border shimmer to video cards on hover ──
  function patchVideoCards() {
    const cards = document.querySelectorAll(
      'ytd-rich-item-renderer:not([gem-patched]), ytd-video-renderer:not([gem-patched])'
    );
    cards.forEach(card => {
      card.setAttribute('gem-patched', '1');
      card.style.cssText += `
        position: relative;
        background: #12122a;
        border-radius: 20px;
        box-sizing: border-box;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      `;
    });
  }

  // ── Storage: load theme enabled state ──
  function isThemeEnabled(cb) {
    chrome.storage.sync.get({ enabled: true }, ({ enabled }) => cb(enabled));
  }

  // ── Toggle root class to activate/deactivate theme ──
  function applyState(enabled) {
    document.documentElement.classList.toggle('gem-theme-active', enabled);
    if (enabled) {
      injectGradientDefs();
      injectStarfield();
    } else {
      const canvas = document.getElementById('gem-starfield');
      if (canvas) canvas.remove();
    }
  }

  // ── Listen for popup toggle messages ──
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'GEM_TOGGLE') applyState(msg.enabled);
  });

  // ── Init ──
  function init() {
    isThemeEnabled(enabled => {
      applyState(enabled);
    });

    // Watch for dynamically added cards (infinite scroll)
    const observer = new MutationObserver(() => patchVideoCards());
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
