/**
 * Module dependencies
 */
const express = require('express')

const Project = require('../models/project')
const auth = require('../middlewares/auth')

const router = express.Router()

/**
 * `Project` route used as `/project`
 * Return the playground page for using in pair-programming collaboration
 * @method {GET} return rendered `playground.pug`
 * @method {POST} handle create new project form on `dashboard` page
 */
router.use(auth.isSignedIn)
router.route('/')
  .get((req, res) => {
    if (!req.query.pid) res.redirect('/dashboard')
    Project.findOne({ pid: req.query.pid }, (err, doc) => {
      res.render('playground', { user: req.user, project: doc })
    })
  })
  .post((req, res) => {
    const newProject = new Project()
    newProject.title = req.body.pName
    newProject.description = req.body.pDescription
    newProject.language = req.body.pLanguage
    newProject.creator = req.user.username
    newProject.collaborator = req.body.pBuddyUsername
    newProject.save((err) => {
      if (err) throw err
    })
    res.redirect('dashboard')
  })

/**
 * Expose `router`
 */
module.exports = router
