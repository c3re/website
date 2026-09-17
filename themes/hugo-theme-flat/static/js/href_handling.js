document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a[href]").forEach(function (element) {
    const url = new URL(element.href);
    // Mail, phone and page anchors keep their native browser behavior.
    if (url.protocol !== "https:" && url.protocol !== "http:") return;
    if (window.location.origin === url.origin) {
      element.classList.add("internal");
    } else {
      element.classList.add("external");
      // Follow links in the same tab unless a template explicitly requests a new one.
      if (element.target === "_blank") {
        element.setAttribute("rel", "noopener noreferrer");
        const hint = document.createElement("span");
        hint.className = "language-status";
        hint.textContent = " (öffnet einen neuen Tab)";
        element.appendChild(hint);
      }
    }
  });
});
