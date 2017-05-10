/**
 * Module dependencies
 */
const express = require('express')
const passport = require('passport')

const userController = require('../controllers/userController')
const auth = require('../middlewares/auth')

const router = express.Router()

/**
 * `Register` route used as /register
 * User can registering the account at this route
 * @method {GET} return register page
 * @method {POST} handle register form with passport strategy
 */
router.route('/')
  .get(auth.isLoggedOut, userController.registerForm)
  .post(passport.authenticate('local-register', {
    successRedirect: '/dashboard',
    failureRedirect: '/register',
    failureFlash: true
  }))

/**
 * Expose `router`
 */
module.exports = router
