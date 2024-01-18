document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a").forEach(function (element) {
    const myhost = window.location.hostname;
    const linkhost = new URL(element.href).hostname;
    if (myhost === linkhost) {
      let prefetchUrl = new URL(element.href).toString();
      // lest make a prefetch tag for this url
      let link = document.createElement("link");
      link.setAttribute("rel", "prefetch");
      link.setAttribute("href", prefetchUrl);
      link.setAttribute("as", "document");
      document.head.appendChild(link);
      element.classList.add("internal");
    } else {
      element.setAttribute("target", "_blank");
      element.classList.add("external");
    }
  });
});
