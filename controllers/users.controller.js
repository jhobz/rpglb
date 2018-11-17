const UserService = require('../services/users.service')

_this = this

exports.getUsers = async function (req, res, next) {
	let page = req.query.page ? req.query.page : 1
	let limit = req.query.limit ? req.query.limit : 10

	try {
		let users = await UserService.getUsers({}, page, limit)
		return res.status(200).json( {
			status: 200,
			data: users,
			message: 'Users received successfully'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}

exports.createUser = async function (req, res, next) {
	// req.body contains the submitted form values

	let user = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	}

	try {
		let createdUser = await UserService.createUser(user)
		return res.status(201).json( {
			status: 201,
			data: createdUser,
			message: 'User created successfully'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}

exports.updateUser = async function (req, res, next) {
	if (!req.body._id) {
		return res.status(400).json( {
			status: 400,
			message: 'id must be present to update user'
		})
	}

	let id = req.body._id
	let user = {
		id,
		firstName: req.body.firstName ? req.body.firstName : null,
		lastName: req.body.lastName ? req.body.lastName : null,
		email: req.body.email ? req.body.email : null,
		username: req.body.username ? req.body.username : null,
		password: req.body.password ? req.body.password : null
	}

	try {
		let updatedUser = await UserService.updateUser(user)
		return res.status(200).json( {
			status: 200,
			data: updatedUser,
			message: 'User updated successfully'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}

exports.removeUser = async function (req, res, next) {
	let id = req.params.id

	try {
		let deleted = await UserService.deleteUser(id)
		return res.status(204).json( {
			status: 204,
			message: 'User successfully deleted'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}
