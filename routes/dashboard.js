const express = require('express')
const router = express.Router()

/* GET dashboard page. */
router.get('/dashboard', (req, res, next) => {
  res.render('dashboard')
})

module.exports = router
