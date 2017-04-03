// import all of modules used for our app
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')

const port = process.env.PORT || 8081
const app = express()
const routes = require('./routes')
const dbConfig = require('./config/dbConfig')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// connect to mongodb
mongoose.connect(dbConfig.url)

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
  console.log(`Listening on localhost:${port}`)
})
