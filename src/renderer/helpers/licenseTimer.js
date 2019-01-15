const moment = require('moment'); //?

export default function daysRemaining(expire) {
    var eventdate = moment(expire);
    var todaysdate = moment();
    return eventdate.diff(todaysdate, 'days');
}


// Usage -> thirtyDaysOld('2019-02-11' )