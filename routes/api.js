const express = require('express')
const auth = require('../middlewares/auth')
const userController = require('../controllers/userController')

const router = express.Router()

router.get('/usernames', auth.isSignedIn, userController.getUsernames)

module.exports = router
