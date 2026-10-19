document.addEventListener("DOMContentLoaded", function () {
    const panel = document.querySelector("[data-door-status]");
    if (!panel) return;

    const bannerLabel = document.getElementById("banner-status-label");
    const bannerDetails = document.getElementById("banner-status-details");
    const bannerSince = document.getElementById("banner-status-since");
    const bannerTemperature = document.getElementById("banner-status-temperature");
    const favicon = document.querySelector("head link[rel~='icon']");
    const dateFormat = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", dateStyle: "medium" });
    const timeFormat = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });
    const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
    let data = null;
    let state = "loading";
    let pending = false;
    let request = null;
    let paused = document.documentElement.dataset.live === "paused";

    function text(standard, simple) {
        return document.documentElement.dataset.simple === "true" ? simple : standard;
    }

    function render() {
        const known = data !== null;
        const open = known && data.state.open;
        const doorState = known ? open ? "open" : "closed" : "unknown";
        for (const value of ["open", "closed", "unknown"]) {
            document.body.classList.toggle("door_" + value, doorState === value);
        }
        const bannerText = known ? open ? text("Hackerh\u00fctte ge\u00f6ffnet", "Die Hackerh\u00fctte ist offen.") : text("Hackerh\u00fctte geschlossen", "Die Hackerh\u00fctte ist zu.") : state === "loading" && !paused ? text("T\u00fcrstatus wird geladen...", "Wir pr\u00fcfen, ob die H\u00fctte offen ist...") : text("T\u00fcrstatus unbekannt", "Ob die H\u00fctte offen ist, wissen wir gerade nicht.");
        if (bannerLabel && bannerLabel.textContent !== bannerText) bannerLabel.textContent = bannerText;
        if (favicon) {
            const href = panel.dataset.faviconBase + (known ? open ? "favopen.png" : "favclosed.png" : "fav.png");
            if (favicon.getAttribute("href") !== href) favicon.setAttribute("href", href);
        }

        if (bannerSince) {
            bannerSince.hidden = true;
            bannerSince.textContent = "";
            bannerSince.removeAttribute("datetime");
        }
        if (known) {
            const changed = data.state.lastchange;
            const since = typeof changed === "number" && Number.isFinite(changed) && changed > 0 && changed * 1000 <= Date.now() ? new Date(changed * 1000) : null;
            if (bannerSince && since && Number.isFinite(since.getTime())) {
                bannerSince.textContent = text("Seit ", "Das ist so seit ") + dateFormat.format(since) + ", " + timeFormat.format(since) + " Uhr";
                bannerSince.dateTime = since.toISOString();
                bannerSince.hidden = false;
            }
        }

        if (bannerTemperature) {
            bannerTemperature.hidden = true;
            bannerTemperature.textContent = "";
        }
        const sensors = known && data.sensors && data.sensors.temperature;
        // Do not label a different room's sensor as the club room.
        const sensor = Array.isArray(sensors) ? sensors.find(function (item) {
            return item && typeof item.location === "string" && item.location.trim().toLowerCase() === "clubraum" && typeof item.value === "number" && Number.isFinite(item.value) && ["\u00b0C", "\u00b0F", "K"].includes(item.unit);
        }) : null;
        if (sensor) {
            const units = { "\u00b0C": "Grad Celsius", "\u00b0F": "Grad Fahrenheit", K: "Kelvin" };
            if (bannerTemperature) {
                bannerTemperature.textContent = text("Temperatur Clubraum: ", "Im Raum: ") + numberFormat.format(sensor.value) + " " + text(sensor.unit, units[sensor.unit]);
                bannerTemperature.hidden = false;
            }
        }
        // Do not leave a stale timestamp or temperature visible after a failed refresh.
        if (bannerDetails) bannerDetails.hidden = (!bannerSince || bannerSince.hidden) && (!bannerTemperature || bannerTemperature.hidden);
    }

    async function refresh() {
        if (pending || paused) return;
        pending = true;
        const controller = new AbortController();
        request = controller;
        const timeout = setTimeout(function () { controller.abort(); }, 10000);
        let failure = "network";
        try {
            const response = await fetch("https://spaceapi.c3re.de/", { signal: controller.signal, cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer" });
            if (!response.ok) {
                failure = "http";
                throw new Error("Door status HTTP error");
            }
            failure = "invalid";
            const result = await response.json();
            if (paused || controller.signal.aborted) return;
            if (!result || !result.state || typeof result.state.open !== "boolean") throw new Error("Invalid door status");
            data = result;
            state = "ready";
        } catch (error) {
            if (paused || controller.signal.reason === "paused") return;
            // A failed refresh makes the current state unknown, not closed.
            data = null;
            state = controller.signal.aborted ? "timeout" : failure;
        } finally {
            clearTimeout(timeout);
            pending = false;
            request = null;
            render();
            if (controller.signal.reason === "paused" && !paused) refresh();
        }
    }

    document.addEventListener("preferenceschange", function () {
        const wasPaused = paused;
        paused = document.documentElement.dataset.live === "paused";
        if (paused && request) request.abort("paused");
        render();
        if (wasPaused && !paused) refresh();
    });
    render();
    refresh();
    setInterval(refresh, 30000);
});
