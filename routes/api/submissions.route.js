const express = require('express')
const router = express.Router()
const passport = require('passport')
const dbConfig = require('../../config/database')
require('../../config/passport')(passport)
const jwt = require('jsonwebtoken')

const GameSubmissionController = require('../../controllers/game-submissions.controller')

router.get('/', passport.authenticate(['jwt','anonymous'], { session: false }), GameSubmissionController.getSubmissions)
router.post('/', GameSubmissionController.createSubmission)
router.put('/', GameSubmissionController.updateSubmission)
router.delete('/:id', GameSubmissionController.removeSubmission)

module.exports = router;
