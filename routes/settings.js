/**
 * Module dependencies
 */
import express from 'express'

const router = express.Router()

/**
 * `Settings`
 * @method {GET}
 * @method {POST}
 */
router.route('/profile')
  .get((req, res) => {
    res.render('editprofile')
    // TODO implementation here
  })
  .post((req, res) => {
    res.redirect('/dashboard')
    // TODO implemetation here
  })

/**
 * Expose `router`
 */
module.exports = router
