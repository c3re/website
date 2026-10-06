document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("terminal-form");
    const input = document.getElementById("terminal-command");
    const history = document.getElementById("terminal-history");
    const transcript = document.getElementById("terminal-transcript");
    const status = document.getElementById("terminal-status");
    if (!form || !input || !history || !transcript || !status) return;

    const routes = new Map();
    document.querySelectorAll("#terminal-directory a[data-route]").forEach(function (link) {
        const url = new URL(link.href);
        if (url.origin !== window.location.origin) return;
        for (const alias of [link.dataset.route, url.pathname, url.pathname.replace(/\/$/, "")]) {
            routes.set(alias, url.pathname);
        }
    });
    const commands = [];
    let cursor = 0;
    let draft = "";

    function append(command, answer, language) {
        const item = document.createElement("li");
        const prompt = document.createElement("div");
        prompt.className = "terminal-prompt";
        prompt.textContent = "$ " + command;
        const output = document.createElement("p");
        output.className = "terminal-answer";
        output.textContent = answer;
        if (language) output.lang = language;
        item.append(prompt, output);
        history.append(item);
        while (history.children.length > 32) history.firstElementChild.remove();
        transcript.scrollTop = transcript.scrollHeight;
        status.lang = language || "de";
        status.textContent = answer;
    }

    function navigate(alias, command) {
        const path = routes.get(alias);
        if (!path) {
            append(command, "Diesen Weg kenne ich nicht. Mit ls findest du das Verzeichnis.");
            return;
        }
        window.location.assign(path);
    }

    function execute(value) {
        const command = value.trim().slice(0, 160);
        if (!command) return;
        commands.push(command);
        if (commands.length > 32) commands.shift();
        cursor = commands.length;
        draft = "";
        input.value = "";
        const normalized = command.toLowerCase().replace(/\s+/g, " ");

        // This is a fixed command dictionary, never a shell, eval or network request.
        if (normalized === "help") {
            append(command, "help · Befehle anzeigen\nls · Fundstücke auflisten\nphilosophie · Unsere Philosophie öffnen\nkontakt · Kontakt öffnen\nopen <Ziel> · Ein Ziel aus ls öffnen\ncd / · Zur Startseite\nwhoami · Wer du hier bist\npwd · Wo du bist\nmate / make mate · Getränk bestellen\nclear · Verlauf leeren\nexit · Zur Startseite");
        } else if (normalized === "ls") {
            append(command, "/unsere-philosophie/\n/kontakt/\n/418/\n/dev/null/\n/cookies.txt\n\nZum Beispiel: open /418/");
        } else if (normalized === "sudo make coffee") {
            append(command, "Permission denied. Try: make mate", "en");
        } else if (normalized === "mate" || normalized === "make mate") {
            append(command, "Mate erfolgreich kompiliert.\nZum Trinken bitte eine echte Flasche öffnen.");
        } else if (normalized === "whoami") {
            append(command, "visitor\nMehr müssen wir nicht wissen. Schön, dass du da bist.");
        } else if (normalized === "pwd") {
            append(command, "/hackerhuette/terminal");
        } else if (normalized === "clear") {
            history.replaceChildren();
            commands.length = 0;
            cursor = 0;
            status.lang = "de";
            status.textContent = "Verlauf und Befehlshistorie geleert.";
        } else if (normalized === "exit" || normalized === "cd /") {
            navigate("home", command);
        } else if (normalized === "philosophie" || normalized === "kontakt") {
            navigate(normalized, command);
        } else if (normalized.startsWith("open ") || normalized.startsWith("cd ")) {
            navigate(normalized.slice(normalized.indexOf(" ") + 1), command);
        } else {
            append(command, "Befehl nicht gefunden. Mit help findest du die verfügbaren Befehle.");
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        execute(input.value);
        input.focus();
    });
    form.querySelectorAll("[data-command]").forEach(function (button) {
        button.addEventListener("click", function () {
            execute(button.dataset.command);
            input.focus();
        });
    });
    input.addEventListener("keydown", function (event) {
        if (event.isComposing || event.ctrlKey || event.altKey || event.metaKey) return;
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        event.preventDefault();
        if (cursor === commands.length) draft = input.value;
        cursor = Math.max(0, Math.min(commands.length, cursor + (event.key === "ArrowUp" ? -1 : 1)));
        input.value = cursor < commands.length ? commands[cursor] : draft;
        input.setSelectionRange(input.value.length, input.value.length);
    });
    window.addEventListener("pagehide", function () {
        commands.length = 0;
        cursor = 0;
        draft = "";
        input.value = "";
        history.replaceChildren();
        status.textContent = "";
    });
    form.hidden = false;
});
