/**
 * Module dependencies
 */
import express from 'express'

import Project from '../models/project'
import auth from '../middlewares/auth'

const router = express.Router()

/**
 * `Dashboard` route used as `/dashboard`
 * Finding user projects from database and pass results to the dashboard file
 * @method {GET} return rendered `dashboard.pug`
 */
router.get('/', auth.isSignedIn, (req, res) => {
  const query = [{ creator: req.user.username }, { collaborator: req.user.username }]
  Project.find({ $or: query }, (err, docs) => {
    res.render('dashboard', { user: req.user, projects: docs })
  })
})

/**
 * Expose `router`
 */
module.exports = router
