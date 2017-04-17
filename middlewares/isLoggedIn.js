/**
 * Expose `isLoggedIn` middlewear
 */
module.exports = function isLoggedIn(req, res, next) {
  return req.isAuthenticated() ? next() : res.redirect('/')
}
