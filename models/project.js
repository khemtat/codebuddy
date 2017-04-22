/**
 * Module dependencies
 */

const mongoose = require('mongoose')

/**
 * `Project` model schema based on Mongoose schema
 */
const projectSchema = mongoose.Schema({
  title: String,

})

module.exports = mongoose.Model('Project', projectSchema)
