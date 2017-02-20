const express = require('express')
const router = express.Router()

/* GET dashboard page. */
router.get('/dashboard', function(req, res, next) {
  res.send('dashboard')
});

module.exports = router

