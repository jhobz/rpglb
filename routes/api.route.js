const express = require('express')
const router = express.Router()

let users = require('./api/users.route')
router.use('/users', users)

module.exports = router
