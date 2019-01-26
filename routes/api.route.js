const express = require('express')
const router = express.Router()

let users = require('./api/users.route')
let submissions = require('./api/submissions.route')
let speedrunEvents = require('./api/speedrun-events.route')
router.use('/users', users)
router.use('/submissions', submissions)
router.use('/events', speedrunEvents)

module.exports = router
