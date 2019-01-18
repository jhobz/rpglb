const express = require('express')
const router = express.Router()
const passport = require('passport')
const dbConfig = require('../../config/database')
require('../../config/passport')(passport)

const UserController = require('../../controllers/users.controller')

router.get('/', passport.authenticate('jwt', { session: false }), UserController.getUsers)
router.post('/', UserController.createUser)
router.put('/', UserController.updateUser)
router.delete('/:id', UserController.removeUser)
router.post('/login', UserController.loginUser)
router.post('/changePassword', passport.authenticate('jwt', { session: false }), UserController.changePassword)

module.exports = router;
