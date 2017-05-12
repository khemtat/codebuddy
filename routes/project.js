/**
 * Module dependencies
 */
const express = require('express')

const auth = require('../middlewares/auth')
const projectController = require('../controllers/projectController')
const { catchErrors } = require('../handlers/errorHandlers')

const router = express.Router()

/**
 * `Project` route used as `/project`
 * Return the playground page for using in pair-programming collaboration
 * @method {GET} return rendered `playground.pug`
 * @method {POST} handle create new project form on `dashboard` page
 */
router
  .use(auth.isSignedIn)
  .route('/')
  .get(projectController.getPlayground)
  .post(catchErrors(projectController.createProject))

/**
 * Expose `router`
 */
module.exports = router
