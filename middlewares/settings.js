/**
 * Setting file for set up all middlewares that needed for server
 */

/**
 * Module dependencies
 */
const express = require('express')
const session = require('express-session')
const path = require('path')
const flash = require('connect-flash')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const redis = require('connect-redis')
const passport = require('passport')
const expressValidator = require('express-validator')

/**
 * Config dependencies
 */
const RedisStore = redis(session)
const redisConfig = require('../config/redis')
const passportConfig = require('../config/passport')
const dbSetup = require('./database')

/**
 * Expose `settings`
 */
module.exports = (app) => {
  // MongoDB setup
  dbSetup()

  // view engine setup
  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'pug')

  // middlewares setting
  app.use(morgan('dev'))
  app.use(flash())
  app.use(expressValidator())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(express.static(path.join(__dirname, '../public')))
  app.use(session({
    secret: 'codebuddysecrets',
    store: new RedisStore(redisConfig),
    resave: true,
    saveUninitialized: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  passportConfig(passport)
}
