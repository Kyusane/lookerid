require('dotenv').config();
const mqtt = require("mqtt");

const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`,
     {
          clean: true,
          connectTimeout: 5000,
          username: `${process.env.MQTT_USERNAME}`,
          password: `${process.env.MQTT_PASSWORD}`,
          reconnectPeriod: 1000,
     });

const establishMQTTConnection = () => {
     client.on("connect", () => {
          client.subscribe("LookerID/controlAccess/#", (err) => {
               if (!err) {
                    client.publish("LookerID/lookers/controlAccess/status", "CONTROL ACCESS STAND BY");
               }
          });
     });
     return true
}

module.exports = {
     establishMQTTConnection,
     client
}