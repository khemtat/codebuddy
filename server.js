/**
 * Module dependencies
 */
const express = require('express')
const http = require('http')
const winston = require('winston')

/**
 * Config dependencies
 */
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 8080

/**
 * Server settings
 */
require('./middlewares/settings')(app)
require('./handlers/socket')(server)

/**
 * Routes handler
 */
app.use(require('./routes/'))

/**
 * Error handler
 */
// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json('File not found')
})

/**
 * Server debugs
 */
server.listen(port, () => {
  winston.info(`✅  Listening on localhost:${port}`)
})
