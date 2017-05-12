const mongoose = require('mongoose')

const Project = mongoose.model('Project')

exports.getPlayground = (req, res) => {
  if (!req.query.pid) res.redirect('/dashboard')
  Project.findOne({ pid: req.query.pid }, (err, doc) => {
    res.render('playground', { project: doc })
  })
}

exports.createProject = async (req, res) => {
  const project = await (new Project(req.body)).save()
  req.flash('success', `Successfully Created ${project.title} Project.`)
  res.redirect('dashboard')
}
