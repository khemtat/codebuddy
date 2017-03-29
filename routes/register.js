const express = require('express')
const router = express.Router()

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register')
})

router.post('/', (req, res, next) => {
  console.log(`user: ${req.body.username}\npassword: ${req.body.password}`)
  res.json(req.body)
})

module.exports = router