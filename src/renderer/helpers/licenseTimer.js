const moment = require('moment'); //?

export default function licenseTimer(createdDate, expires) {
    let timeLeft = moment(moment(expires) - moment(createdDate)).format('DD') //?
    timeLeft < 1 ? expired = true : expired = false
    return expired
}


// Usage -> thirtyDaysOld('2019-01-12T03:27:18.481Z','2019-02-11' )