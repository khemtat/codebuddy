const mongoose = require('mongoose')

const Project = mongoose.model('Project')

exports.getHomepage = (req, res) => {
  res.render('index')
}

exports.userSignout = (req, res) => {
  req.logout()
  res.redirect('/')
}

exports.getDashboard = async (req, res) => {
  await Project
    .find({ $or: [{ creator: req.user.username }, { collaborator: req.user.username }] })
    .sort({ createdAt: -1 })
    .exec((err, docs) => {
      if (err) throw err
      res.render('dashboard', { projects: docs, title: 'Dashboard' })
    })
}

exports.getPlayground = (req, res) => {
  if (!req.query.pid) res.redirect('/dashboard')
  Project.findOne({ pid: req.query.pid }, (err, doc) => {
    res.render('playground', { project: doc, title: `${doc.title} - Playground` })
  })
}

exports.getAboutUs = (req, res) => {
  res.render('aboutus')
}

exports.getFeature = (req, res) => {
  res.render('feature')
}

exports.getProfile = async (req, res) => {
  await Project
    .find({ $or: [{ creator: req.user.username }, { collaborator: req.user.username }] })
    .sort({ createdAt: -1 })
    .exec((err, docs) => {
      if (err) throw err
      res.render('profile', { projects: docs })
    })
}

exports.getNotifications = async (req, res) => {
  await Project
    .find({ $or: [{ creator: req.user.username }, { collaborator: req.user.username }] })
    .sort({ createdAt: -1 })
    .exec((err, docs) => {
      if (err) throw err
      res.render('notifications', { projects: docs })
    })
}

exports.createProject = async (req, res) => {
  const project = await (new Project(req.body)).save()
  req.flash('success', `Successfully Created ${project.title} Project.`)
  res.redirect('dashboard')
}
