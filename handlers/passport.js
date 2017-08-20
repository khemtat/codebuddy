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
      if (err) return done(err)
      return (null, user)
    })
  })

  /**
   * passport strategy for local register
   */
  passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    // checks if user or email is already exists
    if (await User.findOne({ $or: [{ email }, { username: req.body.username }] })) {
      return done(null, false, { message: 'Username or Email is already exist' })
    }
    // saves user to database
    let user = await new User().save({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      info: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        occupation: req.body.occupation,
        gender: req.body.gender
      }
    })
    return done(null, user)
  }))

  /**
   * Passport strategy for local sign in
   */
  passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      const user = await user.findOne({ $or: [{ email }, { username: email }]})
      if (!user) {
        return done(null, false, { message: 'Username or Email is not exist'})
      }
      return user.verifyPassword(password) ? done(null, user) : done(null, false, { message: 'Wrong password' })
    } catch (err) {
      return done(err)
    }
  }))
}

/**
 * Expose `config` for passport instance
 */
module.exports = config
