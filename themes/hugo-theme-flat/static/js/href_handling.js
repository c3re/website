document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a[href]").forEach(function (element) {
    const url = new URL(element.href);
    // Mail, phone and page anchors keep their native browser behavior.
    if (url.protocol !== "https:" && url.protocol !== "http:") return;
    if (window.location.origin === url.origin) {
      element.classList.add("internal");
    } else {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
      element.classList.add("external");
    }
  });
});
