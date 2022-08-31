var clockEl = $("#currentDay");
$(clockEl).text(moment().format("dddd, MMMM YYYY"));

var timeBlocks = [
  "9AM",
  "10AM",
  "11AM",
  "12PM",
  "1PM",
  "2PM",
  "3PM",
  "4PM",
  "5PM",
];

function renderTimeBlocks() {
  var scheduleEl = $("#schedule");

  for (var i = 0; i < timeBlocks.length; i++) {
    var rowEl = $('<tr class="row-12 timeBlock"></tr>');
    var timeDataEl = $(`<td class="col-1 time">${timeBlocks[i]}</td>`);
    var eventDataEl = $('<td class="col-10 event"></td>');

    if (isPassedHour(timeBlocks[i])) {
      $(eventDataEl).addClass("past");
    } else if (isCurrentHour(timeBlocks[i])) {
      $(eventDataEl).addClass("current");
    }

    var buttonEl = $(
      '<td class="col-1 button"><i class="bi bi-align-center bi-save-fill"></i></td>'
    );
    $(buttonEl).on("click", function () {});
    $(rowEl).append(timeDataEl);
    $(rowEl).append(eventDataEl);
    $(rowEl).append(buttonEl);
    $(scheduleEl).append(rowEl);
  }
}

function isCurrentHour(hour) {
  var currentHour = moment().format("hA");
  if (currentHour === hour) {
    return true;
  }
  return false;
}

function isPassedHour(hour) {
  var currentHour = moment(moment().format("hA"), "hA");
  var givenHour = moment(hour, "hA");

  return givenHour.isBefore(currentHour);
}

function init() {
  renderTimeBlocks();
}

init();
