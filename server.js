// ==================================================================
// ========================= Dependencies ===========================
// ==================================================================

// import all of modules used for our app
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

const port = process.env.PORT || 8080
const dbConfig = require('./config/dbConfig')
const redisConfig = require('./config/redisConfig')
const errorHandler = require('./middlewares/handler')

// ==================================================================
// ======================= Server Settings ==========================
// ==================================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// get server ready
app.use(morgan('dev'))
app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
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

// connect to mongodb
mongoose.connect(dbConfig.url, (err) => {
  if (err) throw err
  winston.info('Connect to MongoDB successfully')
})

// ==================================================================
// ============================ Routes ==============================
// ==================================================================

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
  winston.info(`[+] POST form\nreq.body.email: ${req.body.email}\nreq.body.password: ${req.body.password}`)
  res.json({'req.body.email':req.body.email, 'req.body.password': req.body.password})
})

// ======= Register =======

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  // TODO: implement register form
})

// ======= PlayGround =======

app.get('/playground', (req, res) => {
  res.render('playground')
})

app.post('/playground', (req, res) => {
  // TODO: implement playground form
})

// ======= Dashboard =======

app.get('/dashboard', (req, res) => {
  res.render('dashboard')
})

app.post('/dashboard', (req, res) => {
  // TODO: implement dashboard form
})

// ======= editprofile =======

app.get('/editprofile', (req, res) => {
  res.render('editprofile')
})

// ======= Notifications =======

app.get('/notifications', (req, res) => {
  res.render('notifications')
})

app.post('/editprofile', (req, res) => {
  // TODO: implement editprofile form
})

// ==================================================================
// ======================== Middlewears =============================
// ==================================================================

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json('File not found')
})

// error handler
app.use(errorHandler)

// ==================================================================
// ======================= Server Debug =============================
// ==================================================================

app.listen(port, () => {
  winston.info(`Listening on localhost:${port}`)
})
