document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const status = document.getElementById("calendar-status");
    const copyStatus = document.getElementById("calendar-copy-status");
    if (!calendar || !status || !copyStatus) return;

    const url = "https://ical2json.c3re.de/api/?url=https%3A%2F%2Fklaut.c3re.de%2Fremote.php%2Fdav%2Fpublic-calendars%2FA7sGSxRJdzsHBJea%3Fexport&start=today+&end=last+day+of+next+month&maxitems=10";
    const dateOptions = { timeZone: "Europe/Berlin" };
    const dayFormat = new Intl.DateTimeFormat("de-DE", { ...dateOptions, day: "2-digit" });
    const monthFormat = new Intl.DateTimeFormat("de-DE", { ...dateOptions, month: "short" });
    const dateFormat = new Intl.DateTimeFormat("de-DE", { ...dateOptions, dateStyle: "full" });
    const timeFormat = new Intl.DateTimeFormat("de-DE", { ...dateOptions, hour: "2-digit", minute: "2-digit" });
    const weekdayFormat = new Intl.DateTimeFormat("de-DE", { ...dateOptions, weekday: "short" });
    const dayKeyFormat = new Intl.DateTimeFormat("en-CA", { ...dateOptions, year: "numeric", month: "2-digit", day: "2-digit" });
    let events = [];
    let state = "loading";
    let pending = false;
    let invalidEvents = false;
    let copyState = "";
    let copiedLocation = "";

    function text(standard, simple) {
        return document.documentElement.dataset.simple === "true" ? simple : standard;
    }

    function renderCopyStatus() {
        const messages = {
            copying: text("Standort wird kopiert...", "Wir kopieren den Ort..."),
            copied: text("Standort kopiert: ", "Der Ort ist kopiert: "),
            error: text("Kopieren nicht m\u00f6glich. Bitte den Standort markieren und kopieren: ", "Das Kopieren hat nicht geklappt. Bitte markiere und kopiere den Ort selbst: ")
        };
        copyStatus.textContent = copyState ? messages[copyState] + (copyState === "copying" ? "" : copiedLocation) : "";
    }

    function render() {
        const simple = document.documentElement.dataset.simple === "true";
        const today = dayKeyFormat.format(new Date());
        const focusedLocation = calendar.contains(document.activeElement) ? document.activeElement.dataset.calendarCopyLocation : null;
        const fragment = document.createDocumentFragment();
        const messages = {
            loading: text("Termine werden geladen...", "Wir laden die Termine..."),
            http: text("Der Kalenderdienst meldet einen Fehler. Bitte den Kalender oben \u00f6ffnen.", "Die Termine konnten nicht geladen werden. Bitte nutze den Link zum Kalender oben."),
            timeout: text("Zeit\u00fcberschreitung beim Laden der Termine. Bitte den Kalender oben \u00f6ffnen.", "Das Laden der Termine dauert zu lange. Bitte nutze den Link zum Kalender oben."),
            network: text("Der Kalender ist derzeit nicht erreichbar. Bitte den Kalender oben \u00f6ffnen.", "Wir k\u00f6nnen die Termine gerade nicht laden. Bitte nutze den Link zum Kalender oben."),
            invalid: text("Der Kalender liefert keine g\u00fcltigen Termindaten. Bitte den Kalender oben \u00f6ffnen.", "Die Daten aus dem Kalender sind fehlerhaft. Bitte nutze den Link zum Kalender oben.")
        };
        const upcoming = events.filter(function (item) {
            return dayKeyFormat.format(item.date) >= today;
        }).slice(0, 5);

        if (state !== "ready") {
            status.textContent = messages[state];
        } else if (invalidEvents) {
            status.textContent = text("Einige Termine enthalten ung\u00fcltige Daten und fehlen. Bitte auch den Kalender oben pr\u00fcfen.", "Manche Termine haben fehlerhafte Daten. Wir k\u00f6nnen sie nicht zeigen. Bitte sieh auch im Kalender oben nach.");
        } else {
            status.textContent = upcoming.length ? "" : text("Bis Ende n\u00e4chsten Monats sind keine Termine eingetragen.", "Bis Ende n\u00e4chsten Monats stehen keine Termine im Kalender.");
        }
        status.hidden = status.textContent === "";

        for (const item of upcoming) {
            const row = document.createElement("li");
            row.className = "calendar-event";
            const date = document.createElement("time");
            date.className = "calendar-date";
            date.dateTime = item.date.toISOString();
            date.setAttribute("aria-label", dateFormat.format(item.date));
            const day = document.createElement("span");
            day.className = "calendar-day";
            day.textContent = dayFormat.format(item.date);
            const month = document.createElement("span");
            month.className = "calendar-month";
            month.textContent = monthFormat.format(item.date);
            date.append(day, month);

            const details = document.createElement("div");
            details.className = "calendar-details";
            const time = document.createElement("p");
            time.className = "calendar-time";
            time.textContent = weekdayFormat.format(item.date) + ", " + timeFormat.format(item.date) + " Uhr";
            if (dayKeyFormat.format(item.date) === today) {
                const badge = document.createElement("span");
                badge.className = "calendar-today";
                badge.textContent = "Heute";
                time.append(" ", badge);
            }

            const summary = typeof item.summary === "string" ? item.summary.trim() : "";
            const simpleSummary = typeof item.summary_simple === "string" ? item.summary_simple.trim() : "";
            // Only translate the known recurring event, not arbitrary event names.
            const openChaos = /^Open Chaos(?:\s*[-\u2013\u2014]\s*(?:c3RE e\.V\.|All Creatures (?:are )?Welcome))?$/i.test(summary);
            let eventUrl = null;
            if (typeof item.url === "string") {
                try {
                    const parsed = new URL(item.url);
                    if (parsed.protocol === "https:" || parsed.protocol === "http:") eventUrl = parsed.href;
                } catch (error) {
                    // Keep events with invalid links as plain text.
                }
            }
            const title = document.createElement(eventUrl ? "a" : "p");
            title.className = "calendar-title";
            if (eventUrl) title.href = eventUrl;
            title.textContent = simple && simpleSummary ? simpleSummary : simple && openChaos ? "Offenes Treffen f\u00fcr alle (Open Chaos)" : summary || text("Termin ohne Titel", "Termin ohne Namen");
            const description = simple ? item.description_simple : item.description;
            if (typeof description === "string" && description.trim()) {
                title.title = description.trim();
            } else if (simple && openChaos) {
                title.title = "Alle k\u00f6nnen zum offenen Treffen kommen. Wir reden, programmieren und basteln zusammen.";
            }
            details.append(time, title);
            if (simple && summary && !simpleSummary && !openChaos) {
                const note = document.createElement("p");
                note.className = "calendar-note";
                note.textContent = "Name aus dem Kalender. Noch nicht in einfacher Sprache.";
                details.append(note);
            }

            if (typeof item.location === "string" && item.location.trim()) {
                const location = document.createElement("button");
                location.type = "button";
                location.className = "calendar-location";
                location.dataset.calendarCopyLocation = item.location.trim();
                location.textContent = item.location.trim();
                const label = text("Standort kopieren: ", "Ort kopieren: ") + item.location.trim();
                location.setAttribute("aria-label", label);
                location.title = label;
                details.append(location);
            }
            row.append(date, details);
            fragment.append(row);
        }
        calendar.replaceChildren(fragment);
        if (focusedLocation !== null) {
            const button = Array.from(calendar.querySelectorAll("button[data-calendar-copy-location]")).find(function (element) {
                return element.dataset.calendarCopyLocation === focusedLocation;
            });
            if (button) button.focus({ preventScroll: true });
        }
        renderCopyStatus();
    }

    async function refresh() {
        if (pending) return;
        pending = true;
        calendar.setAttribute("aria-busy", "true");
        const controller = new AbortController();
        const timeout = setTimeout(function () { controller.abort(); }, 10000);
        let failure = "network";
        try {
            const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
            if (!response.ok) {
                failure = "http";
                throw new Error("Calendar HTTP error");
            }
            failure = "invalid";
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("Invalid calendar response");
            const valid = [];
            invalidEvents = false;
            for (const item of data) {
                const date = item && typeof item.start === "number" && Number.isFinite(item.start) && item.start > 0 ? new Date(item.start * 1000) : null;
                if (!date || !Number.isFinite(date.getTime()) || date.getUTCFullYear() > 9999) {
                    invalidEvents = true;
                    continue;
                }
                valid.push({ ...item, date });
            }
            if (data.length && !valid.length) throw new Error("No valid calendar dates");
            events = valid.sort(function (a, b) { return a.date - b.date; });
            state = "ready";
        } catch (error) {
            // Never present old or invented events as a live response.
            events = [];
            state = controller.signal.aborted ? "timeout" : failure;
        } finally {
            clearTimeout(timeout);
            pending = false;
            calendar.setAttribute("aria-busy", "false");
            render();
        }
    }

    calendar.addEventListener("click", async function (event) {
        const button = event.target.closest("button[data-calendar-copy-location]");
        if (!button || !calendar.contains(button) || copyState === "copying") return;
        copiedLocation = button.dataset.calendarCopyLocation;
        copyState = "copying";
        renderCopyStatus();
        try {
            if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("Clipboard unavailable");
            await navigator.clipboard.writeText(copiedLocation);
            copyState = "copied";
        } catch (error) {
            copyState = "error";
        }
        renderCopyStatus();
    });

    document.addEventListener("preferenceschange", render);
    render();
    refresh();
    setInterval(refresh, 15 * 60 * 1000);
});
