// wrapped by build app
define("d3/src/locale/en-GB", ["dojo","dijit","dojox"], function(dojo,dijit,dojox){
import "locale";

var d3_locale_enGB = d3.locale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["£", ""],
  dateTime: "%a %e %b %X %Y",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

});
