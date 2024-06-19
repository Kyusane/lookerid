const { errorResponse } = require('../utils/responseTemplate')

class authorization {
     admin(req, res, next) {
          try {
               if (req.role == 2 || req.role == 1) {
                    next()
               } else {
                    return errorResponse(res, 401, "Access denied", "Request is not authorized")
               }
          } catch (error) {
               return errorResponse(res, 401, "Access denied", error.message)
          }
     }
     superadmin(req, res, next) {
          try {
               if (req.role == 1) {
                    next()
               } else {
                    return errorResponse(res, 401, "Access denied", "Request is not authorized")
               }
          } catch (error) {
               return errorResponse(res, 401, "Access denied", error.message)
          }
     }
     user(req, res, next) {
          try {
               if (req.role == 3) {
                    next()
               } else {
                    return errorResponse(res, 401, "Access denied", "Request is not authorized")
               }
          } catch (error) {
               return errorResponse(res, 401, "Access denied", error.message)
          }
     }
}

module.exports = new authorization