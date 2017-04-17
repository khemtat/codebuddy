/**
 * Module dependencies
 */
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

function config(passport) {
  /**
   * serialize users and only parse the user id to the session
   * @param {Object} user
   * @param {Callback} done
   */
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  /**
   * deserialize users out of the session to get the ID that used to find user
   * @param {String} id
   * @param {Callback} done
   */
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  /**
   * passport strategy for local register used for handling a local register form
   */
  passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err)
      if (user) return done(null, false, req.flash('registerMessage', 'This email is already registered on codeboddy'))
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
  }))
}

/**
 * Expose `config` for passport instance
 */
module.exports = config
