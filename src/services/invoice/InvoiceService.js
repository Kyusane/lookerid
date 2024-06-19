const db = require('../dbconnection')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

function generateInvoiceId() {
     const datePart = moment().format('YYYYMMDD');
     const uniquePart = uuidv4().split('-')[0];
     return `INV-${datePart}-${uniquePart}`;
}


function calculateDuration(startTimestamp, endTimestamp) {
     const durationInSeconds = endTimestamp - startTimestamp;
     const duration = moment.duration(durationInSeconds, 'seconds');

     const days = duration.days();
     const hours = duration.hours();
     const minutes = duration.minutes();
     const seconds = duration.seconds();

     return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}

class Invoice {
     find(userID) {
          return new Promise((resolve, reject) => {
               const findInvoiceSQL = 'SELECT id,start_time,end_time,duration,status FROM invoice WHERE user_id = ? ORDER BY end_time DESC LIMIT 10';
               db.query(findInvoiceSQL, [userID], (err, result) => {
                    if (err) {
                         return reject(new Error('UserID Invalid'));
                    }
                    resolve(result);
               });
          });
     }

     create(userID, lookerID, startTime, endTime) {
          return new Promise((resolve, reject) => {
               const duration = endTime - startTime
               const createInvoice = 'INSERT INTO invoice (id, user_id,lookers_id,start_time, end_time, duration, bill, status) VALUES (?,?,?,?,?,?,?,?)'
               db.query(createInvoice, [generateInvoiceId(), userID, lookerID, startTime, endTime, duration, 0, "completed"], (err, result) => {
                    if (err) {
                         return reject(new Error('UserID Invalid'));
                    }
                    resolve(result);
               });
          })
     }

}

module.exports = new Invoice