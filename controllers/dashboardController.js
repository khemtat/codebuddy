const mongoose = require('mongoose')

const Project = mongoose.model('Project')

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
