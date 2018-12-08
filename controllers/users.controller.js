const passport = require('passport')
const dbConfig = require('../config/database')
require('../config/passport')(passport)
const jwt = require('jsonwebtoken')

const UserService = require('../services/users.service')

_this = this

const getTokenFromHeaders = (headers) => {
	if (headers && headers.authorization) {
		let parted = headers.authorization.split(' ')
		if (parted.length === 2) {
			return parted[1]
		}
		return null
	}
	return null
}

exports.getUsers = async function (req, res, next) {
	// Check authorization token to ensure user is logged in
	const token = getTokenFromHeaders(req.headers)
	if (!token) {
		return res.status(403).json( {
			status: 403,
			message: 'Unauthorized'
		} )
	}

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

exports.loginUser = async function (req, res, next) {
	try {
		console.log(req.body.username)
		let user = await UserService.getUser(req.body.username)
		return user.comparePassword(req.body.password, (err, isMatch) => {
			if (isMatch && !err) {
				const token = jwt.sign(user.toJSON(), dbConfig.secret)
				return res.status(200).json( {
					status: 200,
					token: `JWT ${token}`
				} )
			} else {
				return res.status(401).json( {
					status: 401,
					message: 'Login failed. Username or password was incorrect.'
				})
			}
		})
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: `Login failed. Username or password incorrect.`
		} )
	}
}
