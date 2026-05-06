// Copper UI for YouTube — content.js
// Inspired by Claude AI colors by Anthropic

const CLAUDE_ORANGE = '#da7756';
const CLAUDE_BG = '#1a1915';
const CLAUDE_SURFACE = '#242320';

// Force dark mode on YouTube so our theme works better
function forceDarkMode() {
    document.documentElement.setAttribute('dark', '');
    document.documentElement.setAttribute('system-icons', '');
}

// Re-apply theme to dynamically loaded elements
function applyToNewElements() {
    // Fix any white backgrounds that YouTube injects dynamically
    const whiteEls = document.querySelectorAll('[style*="background: white"], [style*="background:#fff"], [style*="background-color: white"], [style*="background-color: rgb(255, 255, 255)"]');
    whiteEls.forEach(el => {
        el.style.background = CLAUDE_BG;
        el.style.color = '#e8e3db';
    });
}

// Smooth page transition effect
function addPageTransition() {
    const style = document.createElement('style');
    style.textContent = `
        ytd-page-manager {
            animation: claudePageFade 0.3s ease !important;
        }
        @keyframes claudePageFade {
            from { opacity: 0.4; }
            to   { opacity: 1; }
        }

        /* Orange cursor glow on video thumbnails */
        ytd-thumbnail:hover::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 10px;
            box-shadow: 0 0 0 2px #da7756, 0 8px 30px #da775640;
            pointer-events: none;
            animation: claudePulse 0.3s ease forwards;
        }

        @keyframes claudePulse {
            from { opacity: 0; transform: scale(0.97); }
            to   { opacity: 1; transform: scale(1); }
        }

        /* Subtle orange underline on hovered links */
        #video-title-link:hover {
            text-decoration: underline !important;
            text-decoration-color: #da7756 !important;
            text-underline-offset: 3px !important;
        }

        /* Orange focus ring on interactive elements */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible {
            outline: 2px solid #da7756 !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
}

// Watch for YouTube's SPA navigation
function observeNavigation() {
    const observer = new MutationObserver(() => {
        forceDarkMode();
        applyToNewElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Init
forceDarkMode();
addPageTransition();
observeNavigation();

// Run once after a short delay to catch late-loaded elements
setTimeout(() => {
    forceDarkMode();
    applyToNewElements();
}, 1000);

setTimeout(() => {
    applyToNewElements();
}, 3000);
