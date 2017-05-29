/**
 * Module dependencies
 */
const express = require('express')

const router = express.Router()

router.use('/', require('./home'))
router.use('/signin', require('./signin'))
router.use('/register', require('./register'))
router.use('/dashboard', require('./dashboard'))
router.use('/project', require('./project'))
router.use('/settings', require('./settings'))
router.use('/aboutus', require('./aboutus'))
router.use('/feature', require('./feature'))
router.use('/profile', require('./profile'))
router.use('/api', require('./api'))

router.get('/editprofile', (req, res) => {
  res.render('editprofile')
})

/**
 * Expose `router`
 */
module.exports = router
