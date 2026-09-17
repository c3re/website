(function () {
    const root = document.documentElement;
    const keys = { theme: "c3re-theme", language: "c3re-lang", size: "c3re-fs", contrast: "c3re-contrast", font: "c3re-font", motion: "c3re-motion", links: "c3re-links", livePaused: "c3re-live-paused" };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const increasedContrast = window.matchMedia("(prefers-contrast: more)");

    function load(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function save(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch (error) {
            // Settings still work for this page when storage is unavailable.
        }
    }

    function readPreferences() {
        const language = load(keys.language);
        const size = Number(load(keys.size));
        return {
            // Explicit project choice: never infer the default theme from the OS.
            theme: load(keys.theme) === "light" ? "light" : "dark",
            language: language === "leicht" || (language === null && load("c3re-simple") === "1") ? "easy" : "standard",
            size: [100, 125, 150].includes(size) ? size : 100,
            contrast: load(keys.contrast) === null ? increasedContrast.matches : load(keys.contrast) === "1",
            font: load(keys.font) === "dys" ? "dys" : "std",
            motion: load(keys.motion) === null ? reducedMotion.matches : load(keys.motion) === "1",
            links: load(keys.links) === "1",
            livePaused: load(keys.livePaused) === "1"
        };
    }

    function sharedLanguage() {
        const hash = window.location.hash.slice(1);
        if (hash.startsWith("sprache=")) {
            const value = new URLSearchParams(hash).get("sprache");
            return value === "leicht" ? "easy" : value === "std" ? "standard" : null;
        }
        if (hash.startsWith("easy-")) return "easy";
        return null;
    }

    let preferences = readPreferences();
    const requestedLanguage = sharedLanguage();
    if (requestedLanguage) {
        preferences.language = requestedLanguage;
        save(keys.language, requestedLanguage === "easy" ? "leicht" : "std");
    }

    function applyAttributes() {
        root.dataset.theme = preferences.theme;
        root.dataset.language = preferences.language;
        // The live displays share the same simpler interface wording.
        root.dataset.simple = String(preferences.language === "easy");
        root.dataset.fs = String(preferences.size);
        root.dataset.fontSize = String(preferences.size);
        root.dataset.contrast = preferences.contrast ? "1" : "0";
        root.dataset.font = preferences.font;
        root.dataset.reading = String(preferences.font === "dys");
        root.dataset.motion = preferences.motion ? "reduce" : "auto";
        root.dataset.links = String(preferences.links);
        root.dataset.live = preferences.livePaused ? "paused" : "auto";
    }

    applyAttributes();

    document.addEventListener("DOMContentLoaded", function () {
        const panel = document.getElementById("a11y-panel");
        const toggle = document.getElementById("a11y-toggle");
        const status = document.getElementById("preferences-status");
        const down = document.getElementById("font-size-down");
        const up = document.getElementById("font-size-up");
        const count = document.getElementById("a11y-count");

        function setPanel(open, restoreFocus) {
            panel.hidden = !open;
            toggle.setAttribute("aria-expanded", String(open));
            if (open) panel.focus({ preventScroll: true });
            else if (restoreFocus) toggle.focus({ preventScroll: true });
        }

        function anchorId() {
            try {
                const hash = window.location.hash.slice(1);
                const id = hash.startsWith("sprache=") ? new URLSearchParams(hash).get("abschnitt") || "" : decodeURIComponent(hash);
                return id.replace(/^(easy|simple)-/, "");
            } catch (error) {
                return "";
            }
        }

        function updateAnchor(scroll, share) {
            const id = anchorId();
            const prefix = preferences.language === "easy" ? "easy-" : "";
            const target = document.getElementById(prefix + id) || document.getElementById(id);
            let nativeTarget = null;
            try {
                nativeTarget = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
            } catch (error) {
                // Malformed fragments are ignored by anchorId as well.
            }
            if (share) {
                // URL fragments stay in the browser and are not sent to the server.
                const hash = new URLSearchParams();
                if (preferences.language === "easy") hash.set("sprache", "leicht");
                if (id && target) hash.set("abschnitt", id);
                const next = preferences.language === "easy" ? "#" + hash : id && target ? "#" + encodeURIComponent(id) : "";
                history.replaceState(null, "", window.location.pathname + window.location.search + next);
            }
            // Native anchors already scroll. Repeating that after hashchange can undo Tab focus.
            if (scroll && id && target && target !== nativeTarget && target.getClientRects().length) target.scrollIntoView();
        }

        function render() {
            const focused = document.activeElement;
            applyAttributes();
            document.querySelectorAll("[data-set-theme]").forEach(function (button) {
                button.setAttribute("aria-pressed", String(button.dataset.setTheme === preferences.theme));
            });
            document.querySelectorAll("[data-toggle-preference]").forEach(function (button) {
                const name = button.dataset.togglePreference;
                const checked = name === "language" ? preferences.language === "easy" : name === "font" ? preferences.font === "dys" : Boolean(preferences[name]);
                button.setAttribute("aria-checked", String(checked));
            });
            document.getElementById("font-size-value").textContent = preferences.size + " %";
            down.disabled = preferences.size === 100;
            up.disabled = preferences.size === 150;
            // Reaching a size limit must not drop focus out of the open panel.
            if (focused === up && up.disabled) down.focus({ preventScroll: true });
            if (focused === down && down.disabled) up.focus({ preventScroll: true });
            const active = Number(preferences.language === "easy") + Number(preferences.size !== 100) + Number(preferences.contrast) + Number(preferences.font === "dys") + Number(preferences.motion) + Number(preferences.links) + Number(preferences.livePaused);
            count.textContent = String(active);
            count.hidden = active === 0;
            const heading = document.querySelector("#main-content h1");
            if (heading) document.title = heading.innerText.trim() + " | c3RE";
            document.dispatchEvent(new CustomEvent("preferenceschange", { detail: { ...preferences } }));
        }

        function change(name, value, message) {
            if (!Object.prototype.hasOwnProperty.call(keys, name)) return;
            preferences[name] = value;
            const stored = name === "language" ? value === "easy" ? "leicht" : "std" : typeof value === "boolean" ? value ? "1" : "0" : value;
            save(keys[name], stored);
            render();
            if (name === "language") updateAnchor(false, true);
            status.textContent = message;
        }

        toggle.addEventListener("click", function () { setPanel(panel.hidden, false); });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !panel.hidden) {
                event.preventDefault();
                setPanel(false, true);
            }
        });
        document.addEventListener("click", function (event) {
            if (!panel.hidden && !panel.contains(event.target) && !toggle.contains(event.target)) setPanel(false, false);
        });
        panel.addEventListener("focusout", function () {
            requestAnimationFrame(function () {
                if (!panel.hidden && !panel.contains(document.activeElement) && document.activeElement !== toggle) setPanel(false, false);
            });
        });
        document.addEventListener("a11yclose", function () { setPanel(false, false); });

        document.querySelectorAll("[data-set-theme]").forEach(function (button) {
            button.addEventListener("click", function () {
                change("theme", button.dataset.setTheme, button.dataset.setTheme === "light" ? "Helles Design eingeschaltet." : "Dunkles Design eingeschaltet.");
            });
        });
        document.querySelectorAll("[data-toggle-preference]").forEach(function (button) {
            button.addEventListener("click", function () {
                const name = button.dataset.togglePreference;
                if (name === "language") change(name, preferences.language === "easy" ? "standard" : "easy", preferences.language === "easy" ? "Originaltext eingeschaltet." : "Leichte Sprache eingeschaltet.");
                else if (name === "font") change(name, preferences.font === "dys" ? "std" : "dys", preferences.font === "dys" ? "Standardschrift eingeschaltet." : "OpenDyslexic eingeschaltet.");
                else {
                    const messages = {
                        contrast: ["Normaler Kontrast eingeschaltet.", "Hoher Kontrast eingeschaltet."],
                        motion: ["Bewegungen folgen wieder der Systemeinstellung.", "Animationen sind ausgeschaltet."],
                        links: ["Zusätzliche Link-Hervorhebung ausgeschaltet.", "Links werden zusätzlich hervorgehoben."],
                        livePaused: ["Live-Anzeigen werden wieder aktualisiert.", "Live-Anzeigen sind pausiert. Angezeigte Werte können veraltet sein."]
                    };
                    if (messages[name]) change(name, !preferences[name], messages[name][preferences[name] ? 0 : 1]);
                }
            });
        });
        down.addEventListener("click", function () { change("size", Math.max(100, preferences.size - 25), "Schrift verkleinert."); });
        up.addEventListener("click", function () { change("size", Math.min(150, preferences.size + 25), "Schrift vergrößert."); });
        document.querySelectorAll("[data-set-language]").forEach(function (button) {
            button.addEventListener("click", function () {
                change("language", "standard", "Originaltext eingeschaltet.");
                document.getElementById("main-content").focus();
            });
        });
        document.getElementById("preferences-reset").addEventListener("click", function () {
            preferences = { ...preferences, language: "standard", size: 100, contrast: increasedContrast.matches, font: "std", motion: reducedMotion.matches, links: false, livePaused: false };
            save(keys.language, "std");
            save(keys.size, "100");
            save(keys.font, "std");
            save(keys.links, "0");
            save(keys.livePaused, "0");
            try {
                localStorage.removeItem(keys.contrast);
                localStorage.removeItem(keys.motion);
            } catch (error) {
                // Reset also works without persistent storage.
            }
            render();
            updateAnchor(false, true);
            status.textContent = "Alle Lesehilfen sind zurückgesetzt.";
        });
        window.addEventListener("storage", function (event) {
            if (event.key === null || Object.values(keys).includes(event.key) || event.key === "c3re-simple") {
                preferences = readPreferences();
                render();
                updateAnchor(false, false);
            }
        });
        window.addEventListener("hashchange", function () {
            const language = sharedLanguage();
            if (language && language !== preferences.language) {
                preferences.language = language;
                save(keys.language, language === "easy" ? "leicht" : "std");
                render();
            }
            updateAnchor(true, false);
        });

        reducedMotion.addEventListener("change", function () {
            if (load(keys.motion) === null) { preferences.motion = reducedMotion.matches; render(); }
        });
        increasedContrast.addEventListener("change", function () {
            if (load(keys.contrast) === null) { preferences.contrast = increasedContrast.matches; render(); }
        });

        render();
        document.querySelector(".preferences").hidden = false;
        toggle.hidden = false;
        updateAnchor(true, false);
    });
})();
