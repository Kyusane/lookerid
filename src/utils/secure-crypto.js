require('dotenv').config();
const CryptoJS = require('crypto-js')


class Secure {
     encrypt(data) {
          try {
               const encrypted = CryptoJS.RC4.encrypt(data, process.env.SECRET_KEY).toString();
               return encrypted;
          } catch (error) {
               throw new Error("Encryption failed");
          }
     }

     decrypt(encrypted) {
          try {
               const decrypted = CryptoJS.RC4.decrypt(encrypted, process.env.SECRET_KEY);
               const originalData = decrypted.toString(CryptoJS.enc.Utf8);

               if (!originalData) {
                    throw new Error("Decryption resulted in empty string");
               }
               return originalData;
          } catch (error) {
               if (error.message.includes("Malformed UTF-8 data")) {
                    throw new Error("Decryption failed: Invalid encrypted data");
               } else {
                    throw new Error("Decryption failed: " + error.message);
               }
          }
     }
}

module.exports = new Secure
