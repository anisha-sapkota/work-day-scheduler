// get current day element and set current day.
var dayEl = $("#currentDay");
$(dayEl).text(moment().format("dddd, Do MMMM YYYY"));

// business hours
var businessHours = [
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

// get schedule element
var scheduleEl = $("#schedule");

// function for rendering time blocks in the schedule elements
function renderTimeBlocks() {
  // loop through business hours
  for (var i = 0; i < businessHours.length; i++) {
    // create table row
    var rowEl = $('<tr class="row-12 timeBlock"></tr>');
    // table data for time
    var timeDataEl = $(`<td class="col-1 hour">${businessHours[i]}</td>`);
    // table data for event
    var eventDataEl = $(
      `<td class="col-10 event" contenteditable data-time-block="${businessHours[i]}"></td>`
    );

    // based on current time apply different classes
    if (isPassedHour(businessHours[i])) {
      // apply past class to passed hour
      $(eventDataEl).addClass("past");
      // past event should not be editable
      $(eventDataEl).attr("contenteditable", false);
    } else if (isCurrentHour(businessHours[i])) {
      // apply present class to present hour
      $(eventDataEl).addClass("present");
    } else {
      // everything else is future
      $(eventDataEl).addClass("future");
    }

    // table data for save button
    var buttonContainerEl = $('<td class="col-1 saveBtn"></td>');
    // save button icon
    var buttonEl = $('<i class="bi bi-align-center bi-save-fill"></i>');
    // add click event listener for save icon
    $(buttonEl).on("click", saveToLocalStorage);

    // append icon to table data
    $(buttonContainerEl).append(buttonEl);
    // append table data to row
    $(rowEl).append(timeDataEl);
    $(rowEl).append(eventDataEl);
    $(rowEl).append(buttonContainerEl);
    // append row to schedule table
    $(scheduleEl).append(rowEl);
  }
}

// function for loading saved data from local storage
function loadData() {
  // loop through the business hours
  for (var i = 0; i < businessHours.length; i++) {
    // key is in following format hA-DDMMMYYYY
    var key = `${businessHours[i]}-${moment().format("DDMMMYYYY")}`;
    // get data from local storage
    var data = localStorage.getItem(key);
    // if there data with that key
    if (data) {
      // render the data on the time block
      var eventEl = $(scheduleEl).find(
        `[data-time-block=${businessHours[i]}]`
      )[0];
      $(eventEl).text(data);
    }
  }
}

// function for displaying saved message
function displaySavedMessage() {
  // get the element and set the html content
  var messageEl = $("#savedMessage").html(
    "Appointment was added to <code>localstorage</code> &#9989;"
  );
  // insert the message before the schedule element
  $(messageEl).insertBefore(scheduleEl);

  // clear the html content of the html element after 5 seconds
  setTimeout(function () {
    $(messageEl).html("");
  }, 5000);
}

// function for saving data to local storage
function saveToLocalStorage(event) {
  // stop click propagation to parent
  event.stopPropagation();
  // get the table row element
  var parentEl = $(event.target).parents(".timeBlock");
  // from the parent get the child with the given class
  var eventEl = $(parentEl).children(".event")[0];
  // extract the text from the element and trim it
  var data = $(eventEl).text().trim();
  // get the business hour from the data attribute
  var time = $(eventEl).attr("data-time-block");
  // create key in following format - hA-MMDDDYYYY using moment
  var key = `${time}-${moment().format("DDMMMYYYY")}`;
  // save the data to local storage
  localStorage.setItem(key, data);
  // display message
  displaySavedMessage();
}

// function for checking if given business hour is current hour
function isCurrentHour(hour) {
  // get current hour in hA format using moment
  var currentHour = moment().format("hA");
  // compare with given hour
  if (currentHour === hour) {
    return true;
  }
  return false;
}

// function for checking if the given hour was in the past
function isPassedHour(hour) {
  // create moment object using the current hour
  var currentHour = moment(moment().format("hA"), "hA");
  // create moment object for given hour
  var givenHour = moment(hour, "hA");
  // check is the given hour is before using the isBefore moment function
  return givenHour.isBefore(currentHour);
}

// function for initialization
function init() {
  // render time blocks
  renderTimeBlocks();
  // load data from local storage
  loadData();
}

// call init function on script load
init();
