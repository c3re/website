const calRefresh=function () {
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

      box.removeClass("loading");
      try{
        for( el of document.querySelectorAll("#calendar li")){
          el.remove()
        }
      }catch(e){}

      let weekDayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

      for (let item of cal) {
        let li = $("<li/>");
        //li.text(item.summary)
        let startDate = new Date(item.start * 1000);

        //check if the date is within today, not tomorrow, not yesterday
        let today = new Date();
        let todayString = today.getFullYear() + "-" + zeropad(today.getMonth() + 1) + "-" + zeropad(today.getDate());
        let startDateString = startDate.getFullYear() + "-" + zeropad(startDate.getMonth() + 1) + "-" + zeropad(startDate.getDate());
        let todayClass=""
        if (todayString === startDateString) todayClass=" today";


        let date = $("<span class='date row"+todayClass+"'/>");
        date.text(
            weekDayNames[startDate.getDay()] +
            "., " +
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
        let summary = $("<span class='summary row'/>");
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
          loc.appendTo(date);
        }

        li.attr("title", item.description);
        li.appendTo(box);
      }
      try{
      document.querySelector("#calendar .loading").remove();
        }catch(e){}

      $(".location", box).click(function () {
        navigator.clipboard.writeText($(this).attr("data-loc"));
      });
    }
  };
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send();
}

document.addEventListener("DOMContentLoaded", function(){
  calRefresh();
  setInterval(calRefresh, 1000*60*15);
});
