const express = require('express')
const router = express.Router()

router.get('/playground', (req, res, next) => {
    res.render('playground')
})

module.exports = router