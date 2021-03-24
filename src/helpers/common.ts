import { uuid } from 'uuidv4';
import dateformat = require('dateformat');

const converDatetoISO = (value) => {
    return dateformat(value, "isoDateTime").replace("+0700","Z");
}

const leadingZero = (value: any) => {
    if(value < 10) {
        value = '0' + value;
    }
    return value;
}

const genUUID = () => {
    return uuid();
}

const toSqlDate = (d: any, withTime:boolean = false) => {
    let date = new Date(d);
    let year = date.getFullYear();
    let month = leadingZero(date.getMonth() + 1);
    let day = leadingZero(date.getDate());
    let callback = year + '-' + month + '-' + day;
    if (withTime) {
      let hour = leadingZero(date.getHours());
      let min = leadingZero(date.getMinutes());
      let sec = leadingZero(date.getSeconds());
      callback += ' '+hour+':'+min+':'+sec;
    }
    return callback;
}

export {
    leadingZero,
    genUUID,
    converDatetoISO,
    toSqlDate
}