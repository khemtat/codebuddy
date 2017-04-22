const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  info: {
    name: String,
    occupation: String,
    gender: String
  },
  projects: Array
})

userSchema.methods.generateHash = function generateHash(plainPassword) {
  return bcrypt.hash(plainPassword, 10, null)
}

userSchema.methods.validPassword = function validPassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.local.password, null)
}

module.exports = mongoose.model('User', userSchema)
