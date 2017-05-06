/**
 * Module dependencies
 */
const mongoose = require('mongoose')
const winston = require('winston')

const dbConfig = require('../config/mongodb')

/**
 * Connect to MongoDB using mongoose
 */
module.exports = () => {
  mongoose.Promise = global.Promise
  mongoose.connect(dbConfig.url, (err) => {
    if (err) throw err
    winston.info('Connect to MongoDB successfully')
  })
}
