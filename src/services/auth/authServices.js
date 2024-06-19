require('dotenv').config();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { v4: uuidv4 } = require('uuid');

const db = require('../dbconnection')

const createToken = (userID, role) => {
     return jwt.sign({ userID, role }, process.env.SECRET_KEY, { expiresIn: '1d' })
}

class User {
     login(email, password) {
          return new Promise(async (resolve, reject) => {
               try {
                    if (!email || !password) { return reject(new Error('All fields must be filled')) }
                    const getUserSQL = `SELECT * FROM users  where users.email= ?`
                    db.query(getUserSQL, [email], async (err, fields) => {
                         if (err) return reject(err)
                         if (fields.length === 0) {
                              return reject(new Error("Email Invalid"))
                         }
                         const matching = await bcrypt.compare(password, fields[0].password)
                         if (!matching) {
                              return reject(new Error('Email or Password Invalid'))
                         }
                         const token = createToken(fields[0].id, fields[0].role)
                         resolve({ email, username: fields[0].username, role: fields[0].role, token })
                    })
               } catch (error) {
                    reject(error);
               }
          })
     }

     register(username, email, password) {
          return new Promise(async (resolve, reject) => {
               try {
                    if (!username || !email || !password) {
                         throw new Error('All fields must be filled');
                    }
                    if (!validator.isEmail(email)) {
                         throw new Error('Email is not valid');
                    }
                    if (!validator.isStrongPassword(password)) {
                         throw new Error('Password not strong enough');
                    }

                    const exists = await emailUsed(email);
                    if (exists) {
                         throw new Error('Email sudah digunakan');
                    }

                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(password, salt);
                    const createStatus = await createUser(username, email, hash);
                    resolve(createStatus);
               } catch (error) {
                    reject(error);
               }
          });
     };

     adminRegister(username, email, password) {
          return new Promise(async (resolve, reject) => {
               try {
                    if (!username || !email || !password) {
                         throw new Error('All fields must be filled');
                    }
                    if (!validator.isEmail(email)) {
                         throw new Error('Email is not valid');
                    }
                    if (!validator.isStrongPassword(password)) {
                         throw new Error('Password not strong enough');
                    }

                    const exists = await emailUsed(email);
                    if (exists) {
                         throw new Error('Email sudah digunakan');
                    }

                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(password, salt);
                    const createStatus = await createAdmin(username, email, hash);
                    resolve(createStatus);
               } catch (error) {
                    reject(error);
               }
          });
     }

     superAdminRegister(username, email, password) {
          return new Promise(async (resolve, reject) => {
               try {
                    if (!username || !email || !password) {
                         throw new Error('All fields must be filled');
                    }
                    if (!validator.isEmail(email)) {
                         throw new Error('Email is not valid');
                    }
                    if (!validator.isStrongPassword(password)) {
                         throw new Error('Password not strong enough');
                    }

                    const exists = await emailUsed(email);
                    if (exists) {
                         throw new Error('Email sudah digunakan');
                    }

                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(password, salt);
                    const createStatus = await createSuperAdmin(username, email, hash);
                    resolve(createStatus);
               } catch (error) {
                    reject(error);
               }
          });
     }

}


const emailUsed = (email) => {
     return new Promise((resolve, reject) => {
          const sqlCheck = `SELECT * FROM users WHERE email = ?`;
          db.query(sqlCheck, [email], (err, results) => {
               if (err) {
                    return reject(err);
               }
               resolve(results.length > 0);
          });
     });
};

const createUser = (username, email, hash) => {
     return new Promise((resolve, reject) => {
          const sqlSignUp = `INSERT INTO users (id, username, email, password, role) VALUES (?,?,?,?,3)`;
          db.query(sqlSignUp, [uuidv4(), username, email, hash], (err) => {
               if (err) {
                    return reject(err);
               }
               resolve(true);
          });
     });
};

const createAdmin = (username, email, hash) => {
     return new Promise((resolve, reject) => {
          const sqlSignUp = `INSERT INTO users (id, username, email, password, role) VALUES (?,?,?,?,2)`;
          db.query(sqlSignUp, [uuidv4(), username, email, hash], (err) => {
               if (err) {
                    return reject(err);
               }
               resolve(true);
          });
     });
};

const createSuperAdmin = (username, email, hash) => {
     return new Promise((resolve, reject) => {
          const sqlSignUp = `INSERT INTO users (id, username, email, password, role) VALUES (?,?,?,?,1)`;
          db.query(sqlSignUp, [uuidv4(), username, email, hash], (err) => {
               if (err) {
                    return reject(err);
               }
               resolve(true);
          });
     });
};



module.exports = new User