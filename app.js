require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

app.use(cors())

const rateLimitMiddleware = require(`./src/middlewares/rateLimit`)

const authRoutes = require('./src/routes/authRoutes')
const lookerRoutes = require('./src/routes/lookerRoutes')

const { establishMQTTConnection } = require('./src/services/mqttConnection')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimitMiddleware(20000));

app.use('/authenticate', authRoutes)
app.use('/lookers', lookerRoutes)

app.get("/", (req, res) => {
  res.status(200).json({ code: 200, mssg: "OK" })
})

app.use('*', (req, res) => {
  res.status(404).json({ code: 404, mssg: "Request Invalid" })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    if (establishMQTTConnection) {
      app.listen(process.env.PORT, () => {
        console.log(`Server is running in http://localhost:${process.env.PORT}`)
      })
    }
  })
  .catch((error) => {
    console.log(error)
  })



