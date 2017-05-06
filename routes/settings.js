/**
 * Module dependencies
 */
const express = require('express')

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

/**
 * Expose `router`
 */
module.exports = router
