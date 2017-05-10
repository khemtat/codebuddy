/**
 * Module dependencies
 */
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy

const User = mongoose.model('User')

function config(passport) {
  /**
   * serialize users and only parse the user id to the session
   * @param {Object} user user instance
   * @param {Function} done callback function
   */
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  /**
   * deserialize users out of the session to get the ID that used to find user
   * @param {String} id user id
   * @param {Function} done callback function
   */
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  /**
   * passport strategy for local register
   */
  passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({ email: email })
    .exec((err, user) => {
      if (err) return done(err)
      if (user) return done(null, false, { message: 'Email is invalid or already taken' })
      User.findOne({ username: req.body.username }, (err, user) => {
        if (user) return done(null, false, { message: 'Username is already taken' })
        const newUser = new User()
        newUser.username = req.body.username
        newUser.email = email
        newUser.info.name = `${req.body.firstname} ${req.body.lastname}`
        newUser.info.occupation = req.body.occupation
        newUser.info.gender = req.body.gender
        newUser.password = password
        newUser.save((err) => {
          if (err) throw err
          return done(null, newUser)
        })
      })
    })
  }))

  /**
   * Passport strategy for local sign in
   */
  passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({ $or: [{ email: email }, { username: email }] })
    .exec((err, user) => {
      if (err) return done(err)
      if (!user) return done(null, false, { message: 'Username is not exists' })
      user.verifyPassword(password, (err, isMatch) => {
        if (err) return done(err)
        return isMatch === true ? done(null, user) : done(null, false, { message: 'Wrong password' })
      })
    })
  }))
}

/**
 * Expose `config` for passport instance
 */
module.exports = config
