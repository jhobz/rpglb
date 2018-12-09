const express = require('express')
const router = express.Router()

let users = require('./api/users.route')
let submissions = require('./api/submissions.route')
router.use('/users', users)
router.use('/submissions', submissions)

module.exports = router
