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
  const projects = await Project
    .find({ $or: [{ creator: req.user.username }, { collaborator: req.user.username }] })
    .sort({ createdAt: -1 })
  res.render('dashboard', { projects, title: 'Dashboard' })
}

exports.getPlayground = (req, res) => {
  if (!req.query.pid) res.redirect('/dashboard')
  const project = Project.findOne({ pid: req.query.pid })
  res.render('playground', { project, title: `${project.title} - Playground` })
}

exports.getAboutUs = (req, res) => {
  res.render('aboutus')
}

exports.getFeature = (req, res) => {
  res.render('feature')
}

exports.getProfile = async (req, res) => {
  const projects = await Project
    .find({ $or: [{ creator: req.user.username }, { collaborator: req.user.username }] })
    .sort({ createdAt: -1 })
  res.render('profile', { projects })
}

exports.getNotifications = async (req, res) => {
  const projects = await Project
    .find({ $or: [{ creator: req.user.username }, { collaborator: req.user.username }] })
    .sort({ createdAt: -1 })
  res.render('notifications', { projects })    
}

exports.createProject = async (req, res) => {
  const project = await (new Project(req.body)).save()
  req.flash('success', `Successfully Created ${project.title} Project.`)
  res.redirect('dashboard')
}
