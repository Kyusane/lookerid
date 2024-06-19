const Secure = require('./src/utils/secure-crypto')


// const QRCode = Secure.encrypt('cd55ea5c-d343-4f38-944b-15b9d0')
// const message = Secure.decrypt("adadasdaskjeqlkwjek")

try {
     const message = "cd55ea5c-d343-4f38-944b-15b9d0";
     const encryptedMessage = Secure.encrypt(message);
     console.log("Encrypted:", encryptedMessage);

     const decryptedMessage = Secure.decrypt(encryptedMessage);
     console.log("Decrypted:", decryptedMessage);
} catch (error) {
     console.error(error.message);
}