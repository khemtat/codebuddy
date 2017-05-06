/**
 * Module dependencies
 */
const express = require('express')
const path = require('path')
const flash = require('connect-flash')
const morgan = require('morgan')
const session = require('express-session')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const winston = require('winston')
const passport = require('passport')
const redis = require('connect-redis')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const RedisStore = redis(session)
const server = http.createServer(app)
const io = socketio(server)

/**
 * Config dependencies
 */
const port = process.env.PORT || 8080
const dbConfig = require('./config/mongodb')
const redisConfig = require('./config/redis')
const passportConfig = require('./config/passport')
const errorHandler = require('./middlewares/handler')

/**
 * Server settings
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Getting server ready
app.use(morgan('dev'))
app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'khktcodebuddysecretsigned',
  store: new RedisStore(redisConfig),
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)

// Connect to mongodb
mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url, (err) => {
  if (err) throw err
  winston.info('Connect to MongoDB successfully')
})

io.on('connection', (socket) => {
  winston.info('User connected')
  socket.on('disconnect', () => {
    winston.info('User disconnected')
  })
  socket.on('code update', (message) => {
    winston.info(JSON.stringify(message))
  })
})

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

// error handler
app.use(errorHandler)

/**
 * Server debugs
 */
server.listen(port, () => {
  winston.info(`Listening on localhost:${port}`)
})
