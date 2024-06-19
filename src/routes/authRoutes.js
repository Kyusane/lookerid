// ROUTE UNTUK HTTP REQEUST AUTHENTIFIKASI

const express = require('express')
const router = express.Router()
const authorization = require('../middlewares/authorization')
const requireAuth = require('../middlewares/requireAuth')
const { signIn, signUp, adminSignUp } = require('../controllers/authController')

router.post('/signin', signIn)
router.post('/signup', signUp)
router.post('/admin/signup', requireAuth, authorization.superadmin, adminSignUp)
module.exports = router