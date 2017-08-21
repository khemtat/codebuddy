/**
 * Module dependencies
 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

/**
 * `User` model schema based on Mongoose schema
 */
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      isAsync: false,
      validator: validator.isAlphanumeric
    },
    required: 'Please enter an username'
  },
  password: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail
    },
    required: 'Please enter an email address'
  },
  info: {
    firstname: {
      type: String,
      required: 'Please enter a personal information',
      trim: true
    },
    lastname: {
      type: String,
      required: 'Please enter a personal information',
      trim: true
    },
    occupation: String,
    gender: String
  }
})

/**
 * Pre save middlewears
 * Generating a hash password before called save function
 * @param {Function} next callback fucntion
 */
userSchema.pre('save', async function (next) {
  const SALT_ROUND = 12
  this.password = await bcrypt.hash(this.password, SALT_ROUND)
  next()
})

/**
 * Comparing between plain password and stored password
 * @param {String} plainPassword retrieve plain password from client
 * @return {Function} callback function which's stored `error value or null` and boolean `isMatch`
 */
userSchema.methods.verifyPassword = async function (plainPassword, done) {
  try {
    return await bcrypt.compare(plainPassword, this.password)
  } catch(err) {
    return done(err)
  }
}

userSchema.plugin(mongodbErrorHandler)

/**
 * Expose `User` model
 */
module.exports = mongoose.model('User', userSchema)
