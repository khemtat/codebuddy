const express = require('express')
const router = express.Router()

/* GET login page. */
router.get('/signin', (req, res, next) => {
  res.render('signin')
})

module.exports = router
