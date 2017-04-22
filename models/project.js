/**
 * Module dependencies
 */
const mongoose = require('mongoose')
const shortid = require('shortid')

/**
 * `Project` model schema based on Mongoose schema
 */
const projectSchema = mongoose.Schema({
  pid: shortid.generate,
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  collaborator: String,
  language: String,
  files: [{ name: String, lastModify: { type: Date, default: Date.now }, code: String }]
})

module.exports = mongoose.Model('Project', projectSchema)
