var moment = require('moment');

var DATE_FORMAT_STRING = 'dddd, MMM Do, YYYY';
var DATE_TIME_FORMAT_STRING = 'dddd, MMM Do YYYY, h:mm:ss a';

var getDisplayDate = function(rawDateTime) {
    return moment(rawDateTime).format(DATE_FORMAT_STRING);
};

var getDisplayDateTime = function(rawDateTime) {
    return moment(rawDateTime).format(DATE_TIME_FORMAT_STRING);
};

module.exports = {
    getDisplayDateTime: getDisplayDateTime,
    getDisplayDate: getDisplayDate
};