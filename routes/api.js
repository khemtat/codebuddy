const express = require('express')
const auth = require('../middlewares/auth')
const userController = require('../controllers/userController')
const { catchErrors } = require('../handlers/errorHandlers')

const router = express.Router()

router.get('/usernames', auth.isSignedIn, catchErrors(userController.getUsernames))

module.exports = router
