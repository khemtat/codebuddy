/**
 * Module dependencies
 */
const mongoose = require('mongoose')
const shortid = require('shortid')

/**
 * `Project` model schema based on Mongoose schema
 */
const projectSchema = mongoose.Schema({
  pid: { type: String, default: shortid.generate },
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  creator: String,
  collaborator: String,
  language: { type: String, default: 'py' },
  files: String
  // files: [{ name: String, lastModify: { type: Date, default: Date.now }, code: String }]
})

/**
 * Expose `Project` model
 */
module.exports = mongoose.model('Project', projectSchema)
