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

exports.validateRegister = (req, res, next) => {
  /**
   * Check field required isn't empty
   */
  // username field
  req.checkBody('username', 'You must enter a username!').notEmpty()
  req.checkBody('username', 'This username is not valid!').isAlphanumeric()

  // email field
  req.checkBody('email', 'You must enter an email address!').notEmpty()
  req.checkBody('email', 'This email is not valid!').isEmail()
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmaiL_remove_subaddress: false
  })

  // password field
  req.checkBody('password', 'Password cannot be blank!').notEmpty()

  // Personal information field
  req.checkBody('firstname', 'Please enter your First Name!').notEmpty()
  req.checkBody('lastname', 'Please enter your Last Name!').notEmpty()
  req.checkBody('gender', 'Please select one gender that matched you').notEmpty()
  req.checkBody('agree', 'Please read and accept our Terms and Conditions').notEmpty()

  const errors = req.validationErrors()
  if (errors) {
    req.flash('error', errors.map(err => err.msg))
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() })
    return
  }
  next()
}

/**
 * Profile `/profile`
 */
exports.getSettingProfile = (req, res) => {
  res.render('editprofile')
}
