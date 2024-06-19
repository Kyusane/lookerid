
const express = require('express')
const router = express.Router()

const rateLimitMiddleware = require(`../middlewares/rateLimit`)
const requireAuth = require('../middlewares/requireAuth')
const authorization = require('../middlewares/authorization')
const {
     accessLooker,
     addLooker,
     getAllLooker,
     getLookerUsedbyUser,
     getLookerHistorybyUser
} = require('../controllers/lookerController')

router.use(requireAuth)
router.get('/currentaccess', authorization.user, getLookerUsedbyUser)
router.get('/history', authorization.user, getLookerHistorybyUser)
router.post('/access', authorization.user, accessLooker)
router.get('/', authorization.admin, getAllLooker)
router.post('/', authorization.admin, addLooker)

module.exports = router