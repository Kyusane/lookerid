const jwt = require('jsonwebtoken')
require('dotenv').config();

const { successResponse, errorResponse } = require('../utils/responseTemplate')

const requireAuth = async (req, res, next) => {
     const { authorization } = req.headers
     if (!authorization) {
          return errorResponse(res, 401, "Access failed", "Authorization token required")
     }
     const token = authorization.split(' ')[1]
     try {
          const { userID, role } = jwt.verify(token, process.env.SECRET_KEY)
          req.userID = userID
          req.role = role
          next()

     } catch (error) {
          return errorResponse(res, 401, "Access denied", "Request is not authorized")
     }
}

module.exports = requireAuth