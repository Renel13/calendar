'use strict';
var monthNameArr     = [ 'January','February','March','April','May','June','July','August','September','October','November','December' ]
var daysArr   = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ];
var monthArr  = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];

//Events list class
function EventList() {
    var self = this;
    self.events = [];
    //add event function
    self.addEvent = function(obj) {
        var dateTime = new Date(obj.year, obj.month, obj.day, obj.hh, obj.mm);
        obj.dateTime = dateTime;
        self.events.push(obj);
        self.sort();
    };
    //sort event function
    self.sort = function() {
        function cmp(a, b) {
            return (a.dateTime < b.dateTime) ? -1 : (a.dateTime > b.dateTime) ? 1 : 0;
        }
        self.events.sort(cmp);
    };
    //display events
    self.displayEvents = function() {
        var eventsList = document.getElementById('events-list');
        //remove existing events
        while (eventsList.firstChild) {
            eventsList.removeChild(eventsList.firstChild);
        }
        //create events
        for (var i = 0; i < self.events.length; i++) {
          var li = document.createElement('li');
          var t = document.createTextNode(self.events[i].day + ' ' + monthNameArr[self.events[i].month] + ' ' +
              self.events[i].year + ' ' + self.events[i].hh + '-' + self.events[i].mm + ': ' + self.events[i].event);
          li.appendChild(t);
          eventsList.appendChild(li);
        }
    };
}

//Popup class
function Popup() {
    var self = this;
    self.eventList = new EventList();
    //show popup form
    self.show = function(day, month, year) {
        var popup = document.getElementById('myPopup');
        popup.style.visibility = 'visible';
        self.day = day;
        self.month = month;
        self.year = year;
        popup.style.top = (day.srcElement.offsetTop - 90) + 'px';
        popup.style.left = day.srcElement.offsetLeft + 'px';
    };
    self.hide = function() {
        var popup = document.getElementById('myPopup');
        popup.style.visibility = 'hidden';
    };

    self.submitForm = function(e) {
        e.preventDefault();
        var eventObj = {
            day: self.day.srcElement.innerText,
            month: self.month,
            year: self.year,
            mm: document.getElementById('min').value,
            hh: document.getElementById('hour').value,
            event: document.getElementById('event').value,
        };
        self.eventList.addEvent(eventObj);
        self.eventList.displayEvents();
        self.hide();

    };
    //add event listener to submit button
    var submitBtn = document.getElementById('submit_form');
    submitBtn.addEventListener('click', self.submitForm);

}

//Calendar class

function Calendar(month, year) {
    var self = this;
    var date = new Date();
    self.currentDay = date.getDate();
    self.currentMonth = date.getMonth();
    self.currentYear = date.getFullYear();
    self.popup = new Popup();

    //init function
    self.init = function(month, year) {
        self.date = new Date(year, month, 1);
        self.day = self.date.getDate();
        self.month = month || self.date.getMonth();
        self.year = year || self.date.getFullYear();
        self.dayOfWeek = self.date.getDay();
        self.daysInMonth = self.getDaysInMonth(self.month, self.year);
        var monthYearCaption = document.querySelector('#currentMonthYear');
        monthYearCaption.innerText = monthNameArr[self.month] + ' ' + self.year;
    };

    self.getDaysInMonth = function(month,year) {
        return new Date(year, month + 1, 0).getDate();
    };

    self.clearDays = function() {
        var days = document.querySelector('ul.days');
        while (days.firstChild) {
            days.removeChild(days.firstChild);
        }
    };

    self.build = function() {
        self.clearDays();
        var days = document.querySelector('ul.days');
        var day = document.createElement('li');
        for (var i = 0; i < self.dayOfWeek-1; i++) {
            var day = document.createElement('li');
            day.className = 'blank';
            days.appendChild(day);
        }
        for (var i = 1; i <= self.daysInMonth; i++) {
            var day = document.createElement('li');
            var t = document.createTextNode(String(i));
            day.appendChild(t);
            if (i === self.currentDay && self.month === self.currentMonth && self.year === self.currentYear) {
                day.className = 'active';
            }
            day.addEventListener('click', self.openPopup)
            days.appendChild(day);
        };
    };

    self.openPopup = function(e) {
        self.popup.show(e, self.month, self.year);
    };

    //Set month function
    self.setMonth = function(e) {
        var add = (e.srcElement.className === 'next') ? 1 : -1;
        switch (self.month) {
            case 0:
                if (add > 0) {
                    self.month += add;
                } else {
                    self.month = 11;
                    self.year = self.year - 1;
                }
                break;
            case 11:
                if (add > 0) {
                    self.month = 0;
                    self.year = self.year + 1;
                } else {
                    self.month += add;
                }
                break;
            default:
                self.month += add;
                break;
        }

        self.init(self.month, self.year);
        self.build();
    };

    //add listeners for prev and next buttons
    var nextBtn = document.querySelector('.next');
    nextBtn.addEventListener('click', self.setMonth);
    var prevBtn = document.querySelector('.prev');
    prevBtn.addEventListener('click', self.setMonth);

    //call init function
    self.init(month, year);
}


$(document).ready(function(){
    var date = new Date();
    var calendar = new Calendar(date.getMonth(), date.getFullYear());
    calendar.build();
});
