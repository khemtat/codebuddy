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
  username: String,
  password: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please enter an email address'
  },
  info: {
    name: String,
    occupation: String,
    gender: String
  }
})

/**
 * Pre save middlewears
 * Generating a hashed password before called save function
 * @param {Function} next
 */
userSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err)
    this.password = hash
    return next()
  })
})

/**
 * Checking plain password and stored passport in database is valid
 * @param {String} plainPassword
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
