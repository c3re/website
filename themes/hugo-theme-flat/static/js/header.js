document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const header = document.querySelector(".header-wrapper");
    const menu = document.getElementById("main-menu");
    const toggle = document.querySelector(".menu-toggle");
    if (!header || !menu || !toggle) return;

    const mobile = window.matchMedia("(max-width: 767px)");
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
        new ResizeObserver(updateHeight).observe(header);
    } else {
        window.addEventListener("resize", updateHeight);
    }
});
