(function () {
    const root = document.documentElement;

    // Dark is the default, regardless of the operating system's color scheme.
    function loadPreference(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // The controls still work when browser storage is unavailable.
        }
    }

    root.dataset.theme = loadPreference("c3re-theme") === "light" ? "light" : "dark";
    root.dataset.simple = loadPreference("c3re-simple") === "1" ? "true" : "false";

    document.addEventListener("DOMContentLoaded", function () {
        const simpleButton = document.getElementById("simple-language");
        const themeButtons = document.querySelectorAll("[data-set-theme]");
        const status = document.getElementById("preferences-status");

        // Both text versions have separate anchors; keep deep links usable.
        function updateAnchor(scroll) {
            if (!window.location.hash) return;
            let id;
            try {
                id = decodeURIComponent(window.location.hash.slice(1));
            } catch (error) {
                return;
            }
            const original = document.getElementById(id);
            const variant = original && original.closest("[data-language]");
            const language = root.dataset.simple === "true" ? "simple" : "standard";
            if (!variant || variant.dataset.language === language) return;
            const targetId = language === "simple" ? "simple-" + id : id.replace(/^simple-/, "");
            const target = document.getElementById(targetId);
            if (target) {
                history.replaceState(null, "", "#" + encodeURIComponent(targetId));
                if (scroll) target.scrollIntoView();
            }
        }

        function updatePreferences() {
            simpleButton.setAttribute("aria-pressed", root.dataset.simple);
            themeButtons.forEach(function (button) {
                button.setAttribute("aria-pressed", String(button.dataset.setTheme === root.dataset.theme));
            });
            const heading = document.querySelector("#main-content h1");
            if (heading) document.title = heading.innerText.trim() + " | c3RE";
            document.dispatchEvent(new Event("preferenceschange"));
        }

        simpleButton.addEventListener("click", function () {
            root.dataset.simple = root.dataset.simple === "true" ? "false" : "true";
            savePreference("c3re-simple", root.dataset.simple === "true" ? "1" : "0");
            updatePreferences();
            updateAnchor(false);
            status.textContent = root.dataset.simple === "true" ? "Einfache Sprache ist eingeschaltet." : "Einfache Sprache ist ausgeschaltet.";
        });

        themeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                root.dataset.theme = button.dataset.setTheme;
                savePreference("c3re-theme", root.dataset.theme);
                updatePreferences();
                status.textContent = root.dataset.theme === "light" ? "Helles Design ist eingeschaltet." : "Dunkles Design ist eingeschaltet.";
            });
        });

        // Keep open tabs in sync, including clearing the stored preferences.
        window.addEventListener("storage", function (event) {
            if (event.key === null || event.key === "c3re-theme" || event.key === "c3re-simple") {
                root.dataset.theme = loadPreference("c3re-theme") === "light" ? "light" : "dark";
                root.dataset.simple = loadPreference("c3re-simple") === "1" ? "true" : "false";
                updatePreferences();
                updateAnchor(false);
            }
        });

        updatePreferences();
        document.querySelector(".preferences").hidden = false;
        updateAnchor(true);
        window.addEventListener("hashchange", function () { updateAnchor(true); });
    });
})();
