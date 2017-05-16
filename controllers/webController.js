const mongoose = require('mongoose')
const Redis = require('ioredis')
const winston = require('winston')

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
    .exec((err, docs) => {
      if (err) throw err
      return docs
    })
  res.render('dashboard', { projects: projects })
}

exports.getPlayground = async (req, res) => {
  if (!req.query.pid) res.redirect('/dashboard')
  await Project.findOne({ pid: req.query.pid }, (err, doc) => {
    res.render('playground', { project: doc })
  })
}

exports.createProject = async (req, res) => {
  const project = await (new Project(req.body)).save()
  req.flash('success', `Successfully Created ${project.title} Project.`)
  res.redirect('dashboard')
}

exports.getEditorCode = async (req, res) => {
  winston.info(`getEditorCode called: with pid: ${req.params.pid}`)
  const data = await new Redis().get(req.params.pid)
  res.send(data).status(200)
}
