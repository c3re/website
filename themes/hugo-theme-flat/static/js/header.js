document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const header = document.querySelector(".header-wrapper");
    const menu = document.getElementById("main-menu");
    const toggle = document.querySelector(".menu-toggle");
    if (!header || !menu || !toggle) return;

    const mobile = window.matchMedia("(max-width: 959px)");
    let compact = false;
    let scheduled = false;

    function setMenu(open) {
        root.dataset.menuOpen = String(open);
        toggle.setAttribute("aria-expanded", String(open));
    }

    function updateHeight() {
        root.style.setProperty("--header-height", header.getBoundingClientRect().height + "px");
    }

    function updateScroll() {
        // Different thresholds prevent flicker near the point where the header shrinks.
        compact = compact ? window.scrollY > 16 : window.scrollY > 80;
        root.dataset.headerCompact = String(compact);
        scheduled = false;
    }

    function revealFocus(element) {
        if (!element || !element.isConnected || element !== document.activeElement) return;
        if (header.contains(element) || element.closest("#a11y-panel, #a11y-toggle, .skip-link")) return;
        const rect = element.getBoundingClientRect();
        const top = header.getBoundingClientRect().bottom + 24;
        const tab = document.getElementById("a11y-toggle");
        const edge = tab && !tab.hidden ? tab.getBoundingClientRect() : null;
        if (edge && rect.right > edge.left && rect.left < edge.right && rect.bottom > edge.top && rect.top < edge.bottom) {
            window.scrollBy(0, rect.top - Math.max(top, edge.bottom + 16));
        } else if (rect.top < top) {
            window.scrollBy(0, rect.top - top);
        } else if (rect.height < window.innerHeight - top && rect.bottom > window.innerHeight - 16) {
            window.scrollBy(0, rect.bottom - window.innerHeight + 16);
        }
    }

    document.addEventListener("focusin", function (event) {
        const element = event.target;
        if (mobile.matches && !header.contains(element)) setMenu(false);
        requestAnimationFrame(function () { revealFocus(element); });
    });

    toggle.addEventListener("click", function () {
        setMenu(root.dataset.menuOpen !== "true");
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && mobile.matches && root.dataset.menuOpen === "true") {
            setMenu(false);
            toggle.focus();
        }
    });

    document.addEventListener("click", function (event) {
        if (!header.contains(event.target)) setMenu(false);
    });

    mobile.addEventListener("change", function () {
        setMenu(false);
        if (!mobile.matches && document.activeElement === toggle) header.querySelector(".site-title").focus();
        updateHeight();
    });

    window.addEventListener("scroll", function () {
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(updateScroll);
        }
    }, { passive: true });

    // Navigation remains visible without JavaScript, including on small screens.
    setMenu(false);
    toggle.hidden = false;
    updateScroll();
    updateHeight();
    if (window.ResizeObserver) {
        new ResizeObserver(function () {
            updateHeight();
        }).observe(header);
    } else {
        window.addEventListener("resize", updateHeight);
    }
});
