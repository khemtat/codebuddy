const express = require('express')
const auth = require('../middlewares/auth')

const router = express.Router()

router.get('/', auth.isLoggedOut, (req, res) => {
  res.render('index')
})

router.get('/signout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
