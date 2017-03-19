const express = require('express')
const router = express.Router()

/* GET login page. */
router.get('/', function(req, res, next) {
<<<<<<< HEAD:routes/signin.js
  res.render('signin')
});
=======
  res.render('login')
})
>>>>>>> 851bd3d85d8dfd540b83d26c54dabd7ab6a43268:routes/login.js

module.exports = router
