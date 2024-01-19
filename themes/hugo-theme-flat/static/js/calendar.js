document.addEventListener("DOMContentLoaded", function () {
  let url =
    "https://ical2json.c3re.de/api/?url=https%3A%2F%2Fcloud.c3re.de%2Fremote.php%2Fdav%2Fpublic-calendars%2FRLKKkdjNYgXH8yEz%3Fexport&start=today&end=next+month&maxitems=10";
  let xmlHttp = new XMLHttpRequest();
  let zeropad = function (i) {
    let o = "";
    if (i <= 9) o += "0";
    o += i;
    return o;
  };
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      let cal = JSON.parse(xmlHttp.responseText);
      let $ = jQuery;
      let box = $("#calendar");
      for (let item of cal) {
        let li = $("<li/>");
        //li.text(item.summary)
        let startDate = new Date(item.start * 1000);
        let date = $("<span class='date'/>");
        date.text(
          zeropad(startDate.getDate()) +
            "." +
            zeropad(1 + startDate.getMonth()) +
            "." +
            startDate.getFullYear() +
            " - " +
            zeropad(startDate.getHours()) +
            ":" +
            zeropad(startDate.getMinutes())
        );
        date.appendTo(li);
        let summary = $("<span class='summary'/>");
        summary.text(item.summary);
        if (item.url) {
          let a = $("<a/>");
          a.attr("href", item.url);
          a.attr("title", item.description);
          a.append(summary);
          a.appendTo(li);
        } else {
          summary.appendTo(li);
        }
        if (item.location) {
          let loc = $("<span class='location'>📍</span>");

          loc.attr("data-loc", item.location);
          loc.attr("title", "Click to copy: " + item.location);
          loc.appendTo(li);
        }

        li.attr("title", item.description);
        li.appendTo(box);
      }
      document.querySelector("#calendar .loading").remove();
      $(".location", box).click(function () {
        navigator.clipboard.writeText($(this).attr("data-loc"));
      });
    }
  };
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send();
});
