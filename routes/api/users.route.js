const express = require('express')
const router = express.Router()

const UserController = require('../../controllers/users.controller')

router.get('/', UserController.getUsers)
router.post('/', UserController.createUser)
router.put('/', UserController.updateUser)
router.delete('/:id', UserController.removeUser)

module.exports = router;
