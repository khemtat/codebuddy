const mongoose = require('mongoose')

module.exports = mongoose.model('User', {
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
