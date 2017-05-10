/**
 * Module dependencies
 */
const mongoose = require('mongoose')
const winston = require('winston')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const dbConfig = require('../config/mongodb')

/**
 * Connect to MongoDB using mongoose
 */
module.exports = () => {
  mongoose.Promise = global.Promise
  mongoose.plugin(mongodbErrorHandler)
  mongoose.connect(dbConfig.url, (err) => {
    if (err) throw err
    winston.info('✅  Connect to MongoDB successfully')
  })
  mongoose.connection.on('error', (err) => {
    winston.err(`⁉️ MongoDB error: \n${err}`)
  })
}
