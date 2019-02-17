const express = require('express')
const router = express.Router()

let users = require('./api/users.route')
let submissions = require('./api/submissions.route')
let speedrunEvents = require('./api/speedrun-events.route')
let payments = require('./api/payments.route')

router.use('/users', users)
router.use('/submissions', submissions)
router.use('/events', speedrunEvents)
router.use('/payments', payments)

module.exports = router
