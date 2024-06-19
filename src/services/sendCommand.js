const { client } = require('../services/mqttConnection')

async function sendCommandToLocker(lookerID) {
     const topic = `LookerID/lookers/controlAccess/${lookerID}`;
     const responseTopic = `LookerID/lookers/response/${lookerID}`;
     const command = "1";

     return new Promise((resolve, reject) => {
          client.subscribe(responseTopic, err => {
               if (err) {
                    reject("Failed to subscribe to ACk Topic")
                    return
               }

               const timeout = setTimeout(() => {
                    client.unsubscribe(responseTopic);
                    reject('ACK not received in time');
               }, 3000);

               client.on('message', (topic, message) => {
                    if (topic === responseTopic) {
                         clearTimeout(timeout)
                         client.unsubscribe(responseTopic)
                         if (message.toString() === 'ACK') {
                              resolve(true);
                         } else {
                              resolve(false);
                         }
                    }
               });

               client.publish(topic, command, (err) => {
                    if (err) {
                         clearTimeout(timeout);
                         client.unsubscribe(responseTopic);
                         reject('Failed to publish command');
                    }
               });

          });
     });
}


// Export the function
module.exports = { sendCommandToLocker }
