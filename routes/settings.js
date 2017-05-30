/**
 * Module dependencies
 */
const express = require('express')
const mongoose = require('mongoose')

const User = mongoose.model('User')
const router = express.Router()

router.route('/profile')
  .get((req, res) => {
    res.render('editprofile', { user: req.user, title: 'Profile Settings' })
    // TODO implementation here
  })
  .post((req, res) => {
    // TODO implement here
    res.send('OK')
  })

/**
 * Expose `router`
 */
module.exports = router
