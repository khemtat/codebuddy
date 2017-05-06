/**
 * Module dependencies
 */
const express = require('express')

/**
 * Import all routes
 */
const home = require('./home')
const signin = require('./signin')
const register = require('./register')
const dashboard = require('./dashboard')
const project = require('./project')
const settings = require('./settings')

const router = express.Router()

router.use('/', home)
router.use('/signin', signin)
router.use('/register', register)
router.use('/dashboard', dashboard)
router.use('/project', project)
router.use('/settings', settings)

router.get('/editprofile', (req, res) => {
  res.render('editprofile')
})

/**
 * Expose `router`
 */
module.exports = router
