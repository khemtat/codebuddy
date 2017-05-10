const passport = require('passport')

/**
 * Sign In Form `/signin`
 */
exports.getSigninForm = (req, res) => {
  res.render('signin')
}

exports.postSigninForm = passport.authenticate('local-signin', {
  successRedirect: '/dashboard',
  failureRedirect: '/signin',
  failureFlash: true
})

/**
 * Register Form `/register`
 */
exports.getRegisterForm = (req, res) => {
  res.render('register')
}

exports.postRegisterForm = passport.authenticate('local-register', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
})
