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
    let user = new User()
    user.username = req.body.username
    user.email = email
    user.info.firstname = req.body.firstname
    user.info.lastname = req.body.lastname
    user.info.occupation = req.body.occupation
    user.info.gender = req.body.gender
    user.password = password
    user = await user.save()
    return done(null, user)
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
      if (!user) return done(null, false, { message: 'Username or Email is not exist' })
      user.verifyPassword(password, (err, isMatch) => {
        if (err) return done(err)
        return isMatch ? done(null, user) : done(null, false, { message: 'Wrong password' })
      })
    })
  }))
}

/**
 * Expose `config` for passport instance
 */
module.exports = config
