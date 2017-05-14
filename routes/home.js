const express = require('express')
const auth = require('../middlewares/auth')
const webController = require('../controllers/webController')

const router = express.Router()

router.get('/', auth.isLoggedOut, webController.getHomepage)

router.get('/signout', webController.userSignout)

module.exports = router
