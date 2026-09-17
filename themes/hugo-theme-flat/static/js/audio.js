document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("page-audio");
    const bar = document.getElementById("audio-bar");
    const start = document.getElementById("audio-start");
    const label = document.getElementById("audio-start-label");
    const pause = document.getElementById("audio-pause");
    const note = document.getElementById("audio-note");
    const toggle = document.getElementById("a11y-toggle");
    if (!audio || !bar || !start) return;
    let source = "";
    let language = "";
    let token = 0;

    function time(value) {
        if (!Number.isFinite(value)) return "0:00";
        return Math.floor(value / 60) + ":" + String(Math.floor(value % 60)).padStart(2, "0");
    }

    function render() {
        const playing = !audio.paused;
        bar.dataset.state = playing ? "playing" : "paused";
        const state = document.getElementById("audio-state");
        const text = playing ? "Liest vor" : "Pause";
        if (state.textContent !== text) state.textContent = text;
        pause.setAttribute("aria-label", playing ? "Vorlesen pausieren" : "Vorlesen fortsetzen");
        pause.firstElementChild.textContent = playing ? "❚❚" : "▶";
        label.textContent = bar.hidden ? "Seite vorlesen" : "Vorlesen beenden";
        document.getElementById("audio-title").textContent = document.querySelector("#main-content h1").innerText.trim();
        document.getElementById("audio-progress").value = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.currentTime / audio.duration : 0;
        document.getElementById("audio-position").textContent = time(audio.currentTime) + " / " + time(audio.duration);
        document.getElementById("audio-speed").textContent = String(audio.playbackRate).replace(".", ",") + "×";
    }

    function stop() {
        token++;
        const restoreFocus = bar.contains(document.activeElement);
        audio.pause();
        if (audio.readyState) audio.currentTime = 0;
        bar.hidden = true;
        render();
        if (restoreFocus) toggle.focus({ preventScroll: true });
    }

    function updateSource() {
        const nextLanguage = document.documentElement.dataset.language;
        const path = nextLanguage === "easy" ? audio.dataset.sourceEasy : audio.dataset.sourceStandard;
        let next = "";
        if (path) {
            const url = new URL(path, window.location.href);
            if (url.origin === window.location.origin) next = url.href;
        }
        if (next !== source || nextLanguage !== language) {
            stop();
            source = next;
            language = nextLanguage;
            audio.removeAttribute("src");
            audio.load();
        }
        start.disabled = !source;
        note.textContent = source ? "" : "Die Audiodatei für diese Sprachfassung wird später ergänzt.";
        note.hidden = Boolean(source);
    }

    async function play() {
        if (!source) return;
        const current = ++token;
        if (audio.src !== source) audio.src = source;
        try {
            await audio.play();
            if (current !== token) return;
            bar.hidden = false;
            render();
            document.dispatchEvent(new Event("a11yclose"));
            pause.focus({ preventScroll: true });
        } catch (error) {
            if (current !== token) return;
            stop();
            note.textContent = "Die Audiodatei konnte nicht abgespielt werden. Bitte versuche es erneut.";
            note.hidden = false;
            document.getElementById("preferences-status").textContent = note.textContent;
        }
    }

    start.addEventListener("click", function () { if (bar.hidden) play(); else stop(); });
    pause.addEventListener("click", function () { if (audio.paused) play(); else audio.pause(); });
    document.getElementById("audio-stop").addEventListener("click", stop);
    document.getElementById("audio-speed").addEventListener("click", function () {
        const rates = [0.8, 1, 1.25];
        audio.playbackRate = rates[(rates.indexOf(audio.playbackRate) + 1) % rates.length];
        render();
    });
    ["pause", "playing", "timeupdate", "durationchange"].forEach(function (name) { audio.addEventListener(name, render); });
    audio.addEventListener("ended", stop);
    audio.addEventListener("error", function () {
        if (!audio.getAttribute("src")) return;
        stop();
        note.textContent = "Die Audiodatei ist gerade nicht verfügbar.";
        note.hidden = false;
        document.getElementById("preferences-status").textContent = note.textContent;
    });
    document.addEventListener("preferenceschange", updateSource);
    window.addEventListener("pagehide", stop);
    updateSource();
});
