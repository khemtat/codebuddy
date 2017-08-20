const passport = require('passport')
const mongoose = require('mongoose')

const User = mongoose.model('User')

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
  res.render('register', { title: 'Register' })
}

exports.postRegisterForm = passport.authenticate('local-register', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
})

/**
 * Validate request body by using express-validator
 */
exports.validateRegister = (req, res, next) => {
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

exports.getProfile = async (req, res) => {
  const username = req.params.username
  const user = await User.findOne({ username })
  res.render('profile', { title: `${user.username} profile`, user })
}

/**
 * Used by autocomplete function in create project
 */
exports.getUsernames = async (req, res) => {
  const data = await User.find({}, { username: 1, _id: 0 }).lean()
  let temp = []
  data.map(obj => {
    temp.push(obj.username)
  })
  res.json(temp).status(200)
}
