/**
 * Module dependencies
 */
const express = require('express')

/**
 * Config dependencies
 */
const app = express()

/**
 * Middlewares setup
 */
require('./middlewares/settings')(app)

/**
 * Routes handler
 */
app.use(require('./routes/'))

/**
 * Error handler
 * catch 404 error and forward to error handler
 */
app.use((req, res, next) => {
  res.status(404).json('File not found')
})

/**
 * Expose server application as a module
 */
module.exports = app
