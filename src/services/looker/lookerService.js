const db = require('../dbconnection')
const { v4: uuidv4 } = require('uuid');

class Looker {
     findAll(lookerID) {
          return new Promise((resolve, reject) => {
               const findLookerSQL = 'SELECT * FROM lookers';
               db.query(findLookerSQL, (err, result) => {
                    if (err) {
                         return reject(new Error('LookerID Invalid'));
                    }
                    resolve(result);
               });
          });
     }

     findById(lookerID) {
          return new Promise((resolve, reject) => {
               const findLookerSQL = 'SELECT * FROM lookers WHERE id = ?';
               db.query(findLookerSQL, [lookerID], (err, result) => {
                    if (err) {
                         return reject(new Error('LookerID Invalid'));
                    }
                    resolve(result[0]);
               });
          });
     }

     register(name, location, payment) {
          return new Promise(async (resolve, reject) => {
               const exists = await nameUsed(name);
               if (exists) {
                    return reject(new Error('Nama sudah digunakan'));
               }
               const registerLookerSQL = 'INSERT INTO lookers (id, name, current_userID, location, payment, status, start_time) VALUES (?, ?, ?, ?, ?, ?, ?)';
               db.query(registerLookerSQL, [uuidv4(), name, 'None', location, payment, 'available', 'None'], (err, result) => {
                    if (err) {
                         return reject(new Error('Register Failed'));
                    }
                    resolve({ name, location });
               });
          });
     }

     findByUser(userID) {
          return new Promise((resolve, reject) => {
               const findByUserSQL = 'SELECT name, location,start_time FROM lookers WHERE current_userID = ?';
               db.query(findByUserSQL, [userID], (err, result) => {
                    if (err) {
                         return reject(new Error('Looker Not Found'));
                    }
                    resolve(result);
               });
          })
     }

     updateCurrentAccess(userID, lookerID, status, startTime) {
          return new Promise((resolve, reject) => {
               const updateAccess = 'UPDATE lookers SET current_userID = ?, status = ?, start_time = ? WHERE id = ?'
               db.query(updateAccess, [userID, status, startTime, lookerID], (err, result) => {
                    if (err) {
                         return reject(new Error('Access Looker Failed'));
                    }
                    resolve(result);
               });
          })
     }

}

const nameUsed = (name) => {
     return new Promise((resolve, reject) => {
          const sqlCheck = `SELECT * FROM lookers WHERE name = ?`;
          db.query(sqlCheck, [name], (err, results) => {
               if (err) {
                    return reject(err);
               }
               resolve(results.length > 0);
          });
     });
};

module.exports = new Looker  