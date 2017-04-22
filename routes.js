// const isLoggedIn = require('./middlewares/isLoggedIn')

module.exports = (app) => {
  // **** NORMAL ROUTES (NO NEED AUTHENTICATED) ****

  // =========================
  // ======= Home Page =======
  // =========================

  app.get('/', (req, res) => {
    res.render('index')
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  // =======================
  // ======= Sign In =======
  // =======================

  app.get('/signin', (req, res) => {
    res.render('signin')
  })

  app.post('/signin', (req, res) => {
    // TODO: implement signin form
  })

  // ========================
  // ======= Register =======
  // ========================

  app.get('/register', (req, res) => {
    res.render('register')
  })

  app.post('/register', (req, res) => {
    // TODO: implement register form
  })

    // ========================
  // ======= PlayGround =======
  // ========================

  app.get('/playground', (req, res) => {
    res.render('playground')
  })

  app.post('/playground', (req, res) => {
    // TODO: implement playground form
  })

  // **** AUTHENTICATE (FIRST LOGIN) ****

  // **** AUTHORIZE (ALREADY LOGGED IN) ****
}
