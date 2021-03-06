const express = require('express')
const auth = require('../middlewares/auth')
const webController = require('../controllers/webController')

const router = express.Router()

router.get('/', auth.isLoggedOut, webController.getAboutUs)

module.exports = router
