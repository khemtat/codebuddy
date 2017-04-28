/**
 * Middlewears handler
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

exports.isSignedIn = (req, res, next) => {
  return req.isAuthenticated() ? next() : res.redirect('/signin')
}

exports.isLoggedOut = (req, res, next) => {
  return req.isAuthenticated() ? res.redirect('/dashboard') : next()
}
