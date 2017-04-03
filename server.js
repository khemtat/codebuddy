// import all of modules used for our app
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const winston = require('winston')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const port = process.env.PORT || 8080
const app = express()
const routes = require('./routes')
const dbConfig = require('./config/dbConfig')
const redisConfig = require('./config/redisConfig')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// get server ready
app.use(morgan('dev'))
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

// connect to mongodb
mongoose.connect(dbConfig.url, (err) => {
  if (err) throw err
  winston.info('Connect to MongoDB successfully')
})

// routes setup
app.use('/', routes.index)
app.use('/users', routes.users)
app.use('/dashboard', routes.dashboard)
app.use('/signin', routes.signin)
app.use('/register', routes.register)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json('File not found')
})

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

app.listen(port, () => {
  winston.info(`Listening on localhost:${port}`)
})
