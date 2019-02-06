//create weekly forecast object
function WeeklyForecast() {
  this.forecasts = [];
}

//create the temperatures and class schedule for the forecast (i.e add items to the ///temperates and schedule array)
WeeklyForecast.prototype.generateRandomForecast = function(numberOfDays) {
  var currentDate = Date.now();
  for (var i = 0; i < numberOfDays; i++) {
    var forecastDate = addDays(currentDate, i);
    var forecastOutcome = this.getRandomOutcome();
    var precipitationInches = this.getRandomPrecipitationInches(forecastOutcome);
    var highTemperature = this.getRandomHighTemperature(forecastOutcome, forecastDate);
    var lowTemperature = highTemperature - (10 + Math.random() * 20);
    var iconPath = this.getIconPath(forecastOutcome);
    this.forecasts.push(new Forecast(forecastDate, precipitationInches, forecastOutcome, highTemperature, lowTemperature, iconPath));
  }
}

//function will return a random weather outcome(possible value include:
//snow, partly cloudy, partly sunny, sunny and rain)
WeeklyForecast.prototype.getRandomOutcome = function() {
  var randomNumber = Math.random() * 5;
  var randomOutcome;
  if (randomNumber < 1 ) {
    randomOutcome = "Snow";
  }
  else if (randomNumber < 2) {
    randomOutcome = "Partly Cloudy";
  }
  else if (randomNumber < 3) {
    randomOutcome = "Partly Sunny";
  }
  else if (randomNumber < 4) {
    randomOutcome = "Sunny";
  }
  else {
    randomOutcome = "Rain";
  }

  return randomOutcome;
}

WeeklyForecast.prototype.getIconPath = function(outcome) {
  var iconPath;
  if (outcome == "Snow") {
    iconPath = "img/snow.png";
  }
  else if (outcome == "Rain") {
    iconPath = "img/rain.png";
  }
  else if (outcome == "Sunny") {
    iconPath = "img/sunny.png";
  }
  else {
    iconPath = "img/partly.png";
  }
  return iconPath;
}

//function will return a random amount of precipitation (in inches)
//based on the outcome provided.
WeeklyForecast.prototype.getRandomPrecipitationInches = function(outcome) {
  var randomPrecipitation = 0;
  if (outcome == "Snow") {
    randomPrecipitation = Math.random() * 6;
  }
  else if (outcome == "Rain") {
    randomPrecipitation = Math.random() * 4;
  }

  return randomPrecipitation;
}

//function will return a random temperature based on the outcome and date provided
WeeklyForecast.prototype.getRandomHighTemperature = function(outcome, date) {
  var randomTemperature = 0;
  var month = date.getMonth();
  if (outcome == "Snow") {
    randomTemperature = 29 + Math.random() * 3;
  }
  else if (month == 11 || month <= 2) {
    //December through March
    randomTemperature = 35 + Math.random() * 15;
  }
  else if (month <= 4) {
    //April through May
    randomTemperature = 45 + Math.random() * 20;
  }
  else if (month <= 8) {
    //June through September
    randomTemperature = 65 + Math.random() * 25;
  }
  else {
    //October through November
    randomTemperature = 45 + Math.random() * 25;
  }

  return randomTemperature;
}

function addDays(date, days) {
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

WeeklyForecast.prototype.showForecast = function() {
  var forecastHtml = "";
  for (i = 0; i < this.forecasts.length; i++) {
    var forecast = this.forecasts[i];
    var weekday = forecast.date.getDay();
    var isWeekDay = weekday > 0 && weekday < 6;
    var cancelButtonHtml = "";
    if (isWeekDay) {
      cancelButtonHtml = `<button id='forecast:${forecast.date.getDate()}' class='btn btn-warning'>Cancel Class</button>`
    }

    forecastHtml +=
    `<div style="float:left; padding:10px; border:1px solid black; height:220px;width:170px;">
      <div style="font-weight:bold;margin-bottom:10px;">
        ${forecast.date.toDateString()}
      </div>
      <div style="margin-bottom:5px;">
        <img style="height:35px; width:35px" src="${forecast.iconPath}" alt="">
      </div>
      <div style="font-weight:bold;margin-bottom:5px;">
        ${forecast.outcome}
      </div>
      <div>
        High: ${forecast.highTemperature}
      </div>
      <div>
        Low: ${forecast.lowTemperature}
      </div>
      <div>
        Precipitation: ${forecast.precipitationInches} inches
      </div>
      <div>
      ${cancelButtonHtml}
      </div>
      </div>`
  }
    $("#forecastContainer").html(forecastHtml);
}

//create forecast object
function Forecast(date, precipitationInches, outcome, highTemperature, lowTemperature, iconPath) {
  this.date = date;
  this.precipitationInches = parseInt(precipitationInches);
  this.outcome = outcome;
  this.highTemperature = parseInt(highTemperature);
  this.lowTemperature = parseInt(lowTemperature);
  this.iconPath = iconPath;
}

function EpicodusSchedule() {
  this.classes = [];
}

EpicodusSchedule.prototype.createSchedule = function(numberOfDays) {
  var currentDate = Date.now();
  for (var i = 0; i < numberOfDays; i++) {
    var classDate = addDays(currentDate, i);
    // console.log(classDate);
    this.classes.push(new EpicodusClass(classDate));
  }
}

EpicodusSchedule.prototype.showEpicodusSchedule = function() {
  var schedule = this;
  var classScheduleHtml = "";
  for (i = 0; i < this.classes.length; i++) {
    var epicodusClass = this.classes[i];
    var weekday = epicodusClass.classDate.getDay();
    var isWeekDay = weekday > 0 && weekday < 6;
    var classStatus = "No Class";
    if (isWeekDay) {
      if (!epicodusClass.isCancelled) {
        classStatus = "Class in-session";
      }
      else {
        classStatus = "Class Cancelled";
      }
    }

    classScheduleHtml +=
    `<div style="float:left; padding:10px; border:1px solid black; height:220px;width:170px;">
      <div style="font-weight:bold;margin-bottom: 20px;">
        ${epicodusClass.classDate.toDateString()}
      </div>
      <div>
        ${classStatus}
      </div>
      </div>`
  }

  $("#classScheduleContainer").html(classScheduleHtml);
  $("#forecastContainer div button").click(function(event) {
    var dayOfMonth = $(event.target).attr("id").split(":")[1];

    schedule.classes.forEach(function(dailyClass) {
      if (dailyClass.classDate.getDate() == dayOfMonth) {
        dailyClass.isCancelled = true;
      }
    });

    schedule.showEpicodusSchedule();
  });
}

//EpicodusClass represents a single day class at Epicodus and whether it is cancelled
function EpicodusClass(date) {
  //class date contains a Date object representing the date of the Epicodus class
  this.classDate = date;

  //is cancelled represents whether the class has been cancelled for the date
  this.isCancelled;
}

$(document).ready(function() {
  var epicodusSchedule = new EpicodusSchedule();
  epicodusSchedule.createSchedule(5);
  var weeklyForecast = new WeeklyForecast();
  weeklyForecast.generateRandomForecast(5);
  weeklyForecast.showForecast();
  epicodusSchedule.showEpicodusSchedule();

  // console.log(weeklyForecast);
  // $("#daySelection").change(function(event) {
  //   var date =
  // });
});
