/**
 * Module dependencies
 */
const express = require('express')

const auth = require('../middlewares/auth')
const userController = require('../controllers/userController')

const router = express.Router()

/**
 * `Sign In` route used as /signin
 * This route used for user authentication
 * @method {GET} retur signin page
 * @method {POST} handle sign in form with passport strategy
 */
router.route('/')
  .get(auth.isLoggedOut, userController.getSigninForm)
  .post(userController.postSigninForm)

/**
 * Expose `router`
 */
module.exports = router
