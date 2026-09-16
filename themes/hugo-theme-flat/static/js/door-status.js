document.addEventListener("DOMContentLoaded", function () {
    const panel = document.querySelector("[data-door-status]");
    if (!panel) return;

    const status = document.getElementById("ds-status");
    const date = document.getElementById("ds-date");
    const temperature = document.getElementById("ds-temp");
    const temperatureRow = panel.querySelector("[data-door-temperature]");
    const icon = panel.querySelector("[data-door-icon-image]");
    const unknownIcon = panel.querySelector("[data-door-icon-unknown]");
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
        const statusText = known ? open ? text("Ge\u00f6ffnet", "Die H\u00fctte ist offen.") : text("Geschlossen", "Die H\u00fctte ist zu.") : text("Unbekannt", "Das wissen wir gerade nicht.");
        if (status.textContent !== statusText) status.textContent = statusText;
        const bannerText = known ? open ? text("Hackerh\u00fctte ge\u00f6ffnet", "Die Hackerh\u00fctte ist offen.") : text("Hackerh\u00fctte geschlossen", "Die Hackerh\u00fctte ist zu.") : state === "loading" ? text("T\u00fcrstatus wird geladen...", "Wir pr\u00fcfen, ob die H\u00fctte offen ist...") : text("T\u00fcrstatus unbekannt", "Ob die H\u00fctte offen ist, wissen wir gerade nicht.");
        if (bannerLabel && bannerLabel.textContent !== bannerText) bannerLabel.textContent = bannerText;
        if (favicon) {
            const href = panel.dataset.faviconBase + (known ? open ? "favopen.png" : "favclosed.png" : "fav.png");
            if (favicon.getAttribute("href") !== href) favicon.setAttribute("href", href);
        }

        icon.hidden = !known;
        unknownIcon.hidden = known;
        if (bannerSince) {
            bannerSince.hidden = true;
            bannerSince.textContent = "";
            bannerSince.removeAttribute("datetime");
        }
        if (known) {
            const src = open ? panel.dataset.doorOpenIcon : panel.dataset.doorClosedIcon;
            if (icon.getAttribute("src") !== src) icon.setAttribute("src", src);
            const changed = data.state.lastchange;
            const since = typeof changed === "number" && Number.isFinite(changed) && changed > 0 && changed * 1000 <= Date.now() ? new Date(changed * 1000) : null;
            date.textContent = since && Number.isFinite(since.getTime()) ? text("Seit ", "Das ist so seit ") + dateFormat.format(since) + ", " + timeFormat.format(since) + " Uhr" : text("Zeitpunkt der letzten \u00c4nderung unbekannt.", "Wir wissen nicht, seit wann.");
            if (bannerSince && since && Number.isFinite(since.getTime())) {
                bannerSince.textContent = date.textContent;
                bannerSince.dateTime = since.toISOString();
                bannerSince.hidden = false;
            }
        } else {
            icon.removeAttribute("src");
            const messages = {
                loading: text("Status wird geladen...", "Wir fragen gerade nach..."),
                http: text("Der Statusdienst meldet einen Fehler.", "Die Abfrage hat nicht geklappt."),
                timeout: text("Zeit\u00fcberschreitung bei der Statusabfrage.", "Die Antwort dauert zu lange."),
                network: text("Der Statusdienst ist derzeit nicht erreichbar.", "Wir bekommen gerade keine Antwort."),
                invalid: text("Der Statusdienst liefert keine g\u00fcltige Angabe.", "Die Antwort sagt nicht, ob die H\u00fctte offen oder zu ist.")
            };
            date.textContent = messages[state];
        }

        temperatureRow.hidden = true;
        temperature.textContent = "";
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
            temperature.textContent = numberFormat.format(sensor.value) + " " + text(sensor.unit, units[sensor.unit]);
            temperatureRow.hidden = false;
            if (bannerTemperature) {
                bannerTemperature.textContent = text("Temperatur Clubraum: ", "Im Raum: ") + temperature.textContent;
                bannerTemperature.hidden = false;
            }
        }
        // Both displays use the same response and the same language preference.
        if (bannerDetails) bannerDetails.hidden = (!bannerSince || bannerSince.hidden) && (!bannerTemperature || bannerTemperature.hidden);
    }

    async function refresh() {
        if (pending) return;
        pending = true;
        const controller = new AbortController();
        const timeout = setTimeout(function () { controller.abort(); }, 10000);
        let failure = "network";
        try {
            const response = await fetch("https://spaceapi.c3re.de/", { signal: controller.signal, cache: "no-store" });
            if (!response.ok) {
                failure = "http";
                throw new Error("Door status HTTP error");
            }
            failure = "invalid";
            const result = await response.json();
            if (!result || !result.state || typeof result.state.open !== "boolean") throw new Error("Invalid door status");
            data = result;
            state = "ready";
        } catch (error) {
            // A failed refresh makes the current state unknown, not closed.
            data = null;
            state = controller.signal.aborted ? "timeout" : failure;
        } finally {
            clearTimeout(timeout);
            pending = false;
            render();
        }
    }

    document.addEventListener("preferenceschange", render);
    render();
    refresh();
    setInterval(refresh, 30000);
});
