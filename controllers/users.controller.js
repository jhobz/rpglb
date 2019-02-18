const passport = require('passport')
const dbConfig = require('../config/database')
require('../config/passport')(passport)
const jwt = require('jsonwebtoken')

const EmailService = require('../services/email.service')
const UserService = require('../services/users.service')

_this = this

function generateToken (user) {
	return jwt.sign(
		{
			_id: user._id,
			username: user.username,
			roles: user.roles
		},
		dbConfig.secret,
		{ expiresIn: '30d' }
	)
}

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
		const token = generateToken(createdUser)
		// Send verification email
		return EmailService.sendVerificationEmail(createdUser, req)
			.then(async (response) => {
				if (response.accepted.length > 0) {
					return res.status(201).json( {
						status: 201,
						data: createdUser,
						token: token,
						message: 'User created successfully'
					} )
				} else {
					await UserService.deleteUser(createdUser._id)
					throw new Error('Failed to send verification email')
				}
			})
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
		password: req.body.password ? req.body.password : null,
		roles: req.body.roles ? req.body.roles : null,
		verificationToken: req.body.verificationToken ? req.body.verificationToken : null,
		attendanceDates: req.body.attendanceDates ? req.body.attendanceDates : null,
		twitch: req.body.twitch ? req.body.twitch : null,
		twitter: req.body.twitter ? req.body.twitter : null,
		discord: req.body.discord ? req.body.discord : null,
		phone: req.body.phone ? req.body.phone : null,
		emergencyContact: req.body.emergencyContact ? req.body.emergencyContact : null,
		onSite: req.body.onSite !== undefined ? req.body.onSite : null,
		miscComments: req.body.miscComments ? req.body.miscComments : null
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
		let user = await UserService.getUser(req.body.username)
		return user.comparePassword(req.body.password, (err, isMatch) => {
			const token = generateToken(user)
			if (isMatch && !err) {
				if (user.verified) {
					return res.status(200).json( {
						status: 200,
						token: `${token}`
					} )
				} else {
					return res.status(401).json( {
						status: 401,
						user: user._id,
						message: 'Login failed. Email is not verified.'
					} )
				}
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
			message: 'Login failed. Username or password incorrect.'
		} )
	}
}

exports.changePassword = async function (req, res, next) {
	try {
		let user = await UserService.getUser(req.body.username)
		return user.comparePassword(req.body.current, async (err, isMatch) => {
			if (isMatch && !err) {
				const userChange = {
					id: user._id,
					password: req.body.new,
				}
				let updatedUser = await UserService.updateUser(userChange)
				const token = generateToken(updatedUser)
				return res.status(200).json( {
					status: 200,
					token: `${token}`
				} )
			} else {
				throw new Error()
			}
		})
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: 'Password unchanged.'
		} )
	}
}

exports.verifyEmail = async function (req, res, next) {
	try{
		let user = await UserService.getUserById(req.body.user)
		if (!req.body.token) {
			// No token, send new email
			return EmailService.sendVerificationEmail(user, req)
				.then((response) => {
					if (response.accepted.length > 0) {
						return res.status(201).json( {
							status: 201,
							message: 'Email sent.'
						} )
					} else {
						return res.status(400).json( {
							status: 400,
							message: 'Something went wrong, try again later.'
						} )
					}
				})
		} else if (user.verificationToken === req.body.token) {
			const updatedUser = await UserService.updateUser({
				id: user._id,
				verified: true
			})
			return res.status(200).json( {
				status: 200,
				user: user.username
			} )
		}
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: 'Verification failed.'
		} )
	}
}

exports.registerUser = async function (req, res, next) {
	// TODO: More validation
	if (!req.user || !req.user._id) {
		return res.status(400).json( {
			status: 400,
			message: 'Must be logged in to register.'
		} )
	}

	if (req.body.v === undefined) {
		return res.status(400).json( {
			status: 400,
			message: 'Registration state unknown.'
		} )
	}

	try {
		// TODO: Capture the response of `addRoles` and `removeRoles` and check that it actually worked
		if (req.body.v) {
			await UserService.addRoles(req.user._id, ['attendee'])
		} else {
			await UserService.removeRoles(req.user._id, ['attendee'])
		}
		let updatedUser = await UserService.getUserById(req.user._id)
		return res.status(200).json( {
			status: 200,
			data: updatedUser,
			token: generateToken(updatedUser) // New token because new roles
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: `Unable to register user.\n${e.message}`
		} )
	}
}

exports.getUserInfo = async function (req, res, next) {
	// TODO: Add more validation
	try {
		let user = await UserService.getUserById(req.user._id)
		return res.status(201).json( {
			status: 201,
			data: user
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: 'Unable to retrieve user information.'
		} )
	}
}
