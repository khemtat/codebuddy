/**
 * Module dependencies
 */
const express = require('express')
const errorHandlers = require('./handlers/errorHandlers')

/**
 * Config dependencies
 */
const app = express()

/**
 * Middlewares setup
 */
require('./middlewares')(app)

/**
 * Routes handler
 */
app.use(require('./routes'))

/**
 * Error handler
 * catch 404 error and forward to error handler
 */
// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound)

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors)

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors)
}

// production error handler
app.use(errorHandlers.productionErrors)

/**
 * Expose server application as a module
 */
module.exports = app
