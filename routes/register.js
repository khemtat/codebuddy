/**
 * Module dependencies
 */
const express = require('express')

const router = express.Router()

const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')
const auth = require('../middlewares/auth')

/**
 * `Register` route used as /register
 * User can registering the account at this route
 * @method {GET} return register page
 * @method {POST} handle register form with passport strategy
 */
router.route('/')
  .get(auth.isLoggedOut, userController.getRegisterForm)
  .post(userController.validateRegister, catchErrors(userController.postRegisterForm))

/**
 * Expose `router`
 */
module.exports = router
