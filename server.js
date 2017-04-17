/**
 * Module dependencies
 */
const express = require('express')
const app = express()
const path = require('path')
const flash = require('connect-flash')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const winston = require('winston')
const passport = require('passport')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

/**
 * Config dependencies
 */
const port = process.env.PORT || 8080
const dbConfig = require('./config/mongodb')
const redisConfig = require('./config/redis')
const passportConfig = require('./config/passport')
const errorHandler = require('./middlewares/handler')

/**
 * Server Settings
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// get server ready
app.use(morgan('dev'))
app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'khktcodebuddysecretsigned',
  store: new RedisStore(redisConfig),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)

// connect to mongodb
mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url, (err) => {
  if (err) throw err
  winston.info('Connect to MongoDB successfully')
})

/**
 * Routes handler
 */
// ======= Home Page =======
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

// ======= Sign In =======
app.get('/signin', (req, res) => {
  res.render('signin')
})

app.post('/signin', (req, res) => {
  // TODO: implement signin form
})

// ======= Register =======
app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', passport.authenticate('local-register', {
  successRedirect: '/',
  failureRedirect: '/register_error',
  failureFlash: true
}))

/**
 * Middlewears handler
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
app.listen(port, () => {
  winston.info(`Listening on localhost:${port}`)
})
