/**
 * Module dependencies
 */
const LocalStrategy = require('passport-local')
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
    passReqToCallBack: true
  },

  ))
}

/**
 * Expose `config` for passport instance
 */
module.exports = config
