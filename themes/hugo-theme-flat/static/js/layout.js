
document.addEventListener("DOMContentLoaded", function() {
document.querySelectorAll('a[href^="http"]').forEach(function(element) {
    const myhost = window.location.hostname;
    const linkhost=new URL(element.href).hostname;
    if(myhost === linkhost) return;
    element.setAttribute("target","_blank");
})
});