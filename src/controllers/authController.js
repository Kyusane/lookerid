require('dotenv').config();
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const User = require('../services/auth/authServices')

const { successResponse, errorResponse } = require('../utils/responseTemplate')

const signIn = async (req, res) => {
     const { email, password } = req.body
     try {
          const user = await User.login(email, password)
          successResponse(res, 200, "Login Success", user)
     } catch (error) {
          errorResponse(res, 400, "Login Failed", error.message)
     }
}

const signUp = async (req, res) => {
     const { email, password, username } = req.body
     try {
          const user = await User.register(username, email, password)
          if (user) {
               successResponse(res, 200, "Register success", email)
          }

     } catch (error) {
          errorResponse(res, 400, "Register Failed", error.message)
     }

}
const adminSignUp = async (req, res) => {
     const { email, password, username } = req.body
     try {
          const user = await User.adminRegister(username, email, password)
          if (user) {
               successResponse(res, 200, "Register success", email)
          }
     } catch (error) {
          errorResponse(res, 400, "Register Failed", error.message)
     }
}

module.exports = {
     signIn,
     signUp,
     adminSignUp
}