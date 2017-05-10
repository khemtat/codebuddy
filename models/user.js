/**
 * Module dependencies
 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

/**
 * `User` model schema based on Mongoose schema
 */
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [{ validator: username => validator.isAlphanumeric(username), msg: 'Invalid username' }],
    required: [true, 'Username required']
  },
  password: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [{ validator: email => validator.isEmail(email), msg: 'Invalid Email Address' }],
    required: [true, 'User email address required']
  },
  info: {
    name: String,
    occupation: String,
    gender: String
  }
})

/**
 * Pre save middlewears
 * Generating a hash password before called save function
 * @param {Function} next callback fucntion
 */
userSchema.pre('save', function preSave(next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err)
    this.password = hash
    return next()
  })
})

/**
 * Comparing between plain password and stored password
 * @param {String} plainPassword retrieve plain password from client
 * @return {Function} callback function which's stored `error value or null` and boolean `isMatch`
 */
userSchema.methods.verifyPassword = function verifyPassword(plainPassword, done) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return done(err)
    return done(null, isMatch)
  })
}

/**
 * Expose `User` model
 */
module.exports = mongoose.model('User', userSchema)
