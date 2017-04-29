/**
 * Module dependencies
 */
import express from 'express'

/**
 * Import all routes
 */
import home from './home'
import signin from './signin'
import register from './register'
import dashboard from './dashboard'
import project from './project'
import settings from './settings'

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
