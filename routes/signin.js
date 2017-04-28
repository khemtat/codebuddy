/**
 * Module dependencies
 */
import express from 'express'
import passport from 'passport'

import auth from '../middlewares/auth'

const router = express.Router()

/**
 * `Sign In` route used as /signin
 * This route used for user authentication
 * @method {GET} retur signin page
 * @method {POST} handle sign in form with passport strategy
 */
router.route('/')
  .get(auth.isLoggedOut, (req, res) => {
    res.render('signin')
  })
  .post(passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin',
    failureFlash: true
  }))

/**
 * Expose `router`
 */
module.exports = router
