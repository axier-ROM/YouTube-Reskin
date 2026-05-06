// popup.js — Gemini Theme for YouTube

(function () {
  const toggle     = document.getElementById('themeToggle');
  const badge      = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');

  // ── Starfield ──
  const canvas = document.getElementById('stars');
  const ctx    = canvas.getContext('2d');
  canvas.width  = 300;
  canvas.height = 300;

  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random() * 300,
    y: Math.random() * 300,
    r: Math.random() * 1 + 0.3,
    a: Math.random(),
    s: Math.random() * 0.005 + 0.002,
    p: Math.random() * Math.PI * 2,
  }));

  let raf;
  function drawStars(t) {
    ctx.clearRect(0, 0, 300, 300);
    stars.forEach(s => {
      const a = s.a * (0.5 + 0.5 * Math.sin(t * s.s * 1000 + s.p));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,190,255,${a})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(drawStars);
  }
  raf = requestAnimationFrame(drawStars);

  // ── UI state ──
  function setUI(enabled) {
    toggle.checked = enabled;
    if (enabled) {
      badge.classList.add('active');
      statusText.textContent = 'Active';
    } else {
      badge.classList.remove('active');
      statusText.textContent = 'Inactive';
    }
  }

  // ── Send message to active YouTube tab ──
  function notifyTab(enabled) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url && tab.url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tab.id, { type: 'GEM_TOGGLE', enabled });
      }
    });
  }

  // ── Load persisted state ──
  chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
    setUI(enabled);
  });

  // ── Toggle handler ──
  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ enabled });
    setUI(enabled);
    notifyTab(enabled);
  });
})();
