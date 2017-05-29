/**
 * Module dependencies
 */
const express = require('express')

const auth = require('../middlewares/auth')
const webController = require('../controllers/webController')
const { catchErrors } = require('../handlers/errorHandlers')

const router = express.Router()

/**
 * `Project` route used as `/project`
 * Return the playground page used in pair-programming collaboration
 * @method {GET} return rendered `playground.pug`
 * @method {POST} handle create new project form on `dashboard` page
 */
router
  .use(auth.isSignedIn)
  .route('/')
  .get(webController.getPlayground)
  .post(catchErrors(webController.createProject))

router
  .use(auth.isSignedIn)
  .route('/getCode/:pid')
  .get(catchErrors(webController.getEditorCode))

/**
 * Expose `router`
 */
module.exports = router
