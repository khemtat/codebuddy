/**
 * Module dependencies
 */
const express = require('express')

const auth = require('../middlewares/auth')
const dashboardController = require('../controllers/dashboardController')

const router = express.Router()

/**
 * `Dashboard` route used as `/dashboard`
 * Finding user projects from database and pass results to the dashboard file
 * @method {GET} return rendered `dashboard.pug`
 */
router.get('/', auth.isSignedIn, dashboardController.getDashboard)

/**
 * Expose `router`
 */
module.exports = router
