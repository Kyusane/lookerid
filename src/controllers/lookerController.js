const Looker = require('../services/looker/lookerService')
const Invoice = require('../services/invoice/InvoiceService')
const Secure = require('../utils/secure-crypto')

const moment = require('moment');

const { client } = require('../services/mqttConnection')
const { getTimeStamps } = require('../services/getTimestamps')
const { sendCommandToLocker } = require('../services/sendCommand')
const { successResponse, errorResponse } = require('../utils/responseTemplate')

const accessLooker = async (req, res) => {
     const { lookerID } = req.body;
     const ts = parseInt(new Date().getTime() / 1000)
     try {
          const id = Secure.decrypt(lookerID)
          const lookerData = await Looker.findById(id);
          if (!lookerData) {
               return errorResponse(res, 400, "Access Failed", 'Looker not found')
          }

          if (lookerData.current_userID != req.userID) {
               if (lookerData.current_userID !== 'None' || lookerData.status !== "available") {
                    return successResponse(res, 200, "Access failed", { lookerName: lookerData.lookerName, message: "Locker is currently in use" })
               }
               const responseResult = await sendCommandToLocker(id);
               // const responseResult = true;
               if (responseResult) {
                    await Looker.updateCurrentAccess(req.userID, id, 'occupied', ts)
                    return successResponse(res, 200, "Access success", {
                         name: lookerData.name,
                         start_time: moment.unix(ts).format('YYYY-MM-DD HH:mm:ss'),
                         end_time: "-",
                         message: "Please store your item"
                    })
               } else {
                    return errorResponse(res, 500, "Access Failed", 'Failed to control locker. Please try again later.')
               }
          }

          const responseResult2 = await sendCommandToLocker(id);
          // const responseResult2 = true;
          if (responseResult2) {
               await Invoice.create(req.userID, id, lookerData.start_time, ts)
               await Looker.updateCurrentAccess('None', id, 'available', 'None')
               return successResponse(res, 200, "Access success", {
                    name: lookerData.name,
                    start_time: moment.unix(lookerData.start_time).format('YYYY-MM-DD HH:mm:ss'),
                    end_time: moment.unix(ts).format('YYYY-MM-DD HH:mm:ss'),
                    message: "Please retrieve your item"
               })
          }
     } catch (error) {
          return errorResponse(res, 500, "Access Failed", 'Failed to control locker. Please try again later.')
     }
}

const addLooker = async (req, res) => {
     const { name, location, payment } = req.body
     try {
          const looker = await Looker.register(name, location, payment)
          successResponse(res, 200, 'Register success', { lookerName: looker.name, location: looker.location, message: "Looker is registered" })
     } catch (error) {
          return errorResponse(res, 400, "Register failed", error.message)
     }
}

const getLookerUsedbyUser = async (req, res) => {
     try {
          const lookers = await Looker.findByUser(req.userID)
          successResponse(res, 200, 'Get data success', { lookers })
     } catch (error) {
          return errorResponse(res, 400, "Get data failed", error.message)
     }
}

const getLookerHistorybyUser = async (req, res) => {
     try {
          const getHistory = await Invoice.find(req.userID)
          successResponse(res, 200, 'Get history success', { history: getHistory })
     } catch (error) {
          return errorResponse(res, 400, "Get history failed", error.message)
     }
}

const getAllLooker = async (req, res) => {
     try {
          const getLookers = await Looker.findAll()
          successResponse(res, 200, 'Get Lookers success', { lookers: getLookers })
     } catch (error) {
          return errorResponse(res, 400, "Get history failed", error.message)
     }
}

module.exports = {
     accessLooker,
     addLooker,
     getAllLooker,
     getLookerUsedbyUser,
     getLookerHistorybyUser
}