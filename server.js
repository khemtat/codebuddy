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

/**
 * Middlewears handler
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

function isSignedIn(req, res, next) {
  return req.isAuthenticated() ? next() : res.redirect('/signin')
}

function isLoggedOut(req, res, next) {
  return req.isAuthenticated() ? res.redirect('/dashboard') : next()
}

/**
 * Routes handler
 */
// ======= Home Page =======
app.get('/', isLoggedOut, (req, res) => {
  res.render('index')
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

// ======= Sign In =======
app.get('/signin', isLoggedOut, (req, res) => {
  res.render('signin')
})

app.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/dashboard',
  failureRedirect: '/signin',
  failureFlash: true
}))

// ======= Register =======
app.get('/register', isLoggedOut, (req, res) => {
  res.render('register', { message: req.flash('error') })
})

app.post('/register', passport.authenticate('local-register', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
}))

// ======== Dashboard ========
app.get('/dashboard', isSignedIn, (req, res) => {
  winston.info(`req.user : ${req.user}`)
  res.render('dashboard', { user: req.user })
})

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
app.listen(port, () => {
  winston.info(`Listening on localhost:${port}`)
})
