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
  })
  .post(async (req, res) => {
    // TODO: implement here
    await User.findOneAndUpdate({ username: req.user.username }, { })
    res.send('OK')
  })

/**
 * Expose `router`
 */
module.exports = router
