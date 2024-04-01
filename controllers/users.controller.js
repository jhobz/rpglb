const passport = require('passport')
const dbConfig = require('../config/database')
require('../config/passport')(passport)
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

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
	if (!req.user || !req.user._id || !req.user.roles || (!req.user.roles.includes('admin') && !req.user.roles.includes('safety'))) {
		console.warn('Unauthorized user info request attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You do not have permission to get user info.'
		} )
	}

	let page = !isNaN(req.query.page) ? parseInt(req.query.page) : 1
	let limit = !isNaN(req.query.limit) ? parseInt(req.query.limit) : 10
	let filter = req.query.filter ? req.query.filter : ''

	try {
		let users = await UserService.getUsers({username: {$regex: filter, $options: 'i'}}, page, limit)
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
		// Send verification email
		return EmailService.sendVerificationEmail(createdUser, req)
			.then(async (response) => {
				if (response.accepted.length > 0) {
					return res.status(201).json( {
						status: 201,
						data: createdUser,
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
		resetToken: req.body.resetToken ? req.body.resetToken : null,
		roles: req.body.roles ? req.body.roles : null,
		verificationToken: req.body.verificationToken ? req.body.verificationToken : null,
		attendanceDates: req.body.attendanceDates ? req.body.attendanceDates : null,
		twitch: req.body.twitch ? req.body.twitch : null,
		twitter: req.body.twitter ? req.body.twitter : null,
		discord: req.body.discord ? req.body.discord : null,
		phone: req.body.phone ? req.body.phone : null,
		pronouns: req.body.pronouns ? req.body.pronouns : null,
		shouldPrintPronouns: req.body.shouldPrintPronouns ? req.body.shouldPrintPronouns : null,
		emergencyContact: req.body.emergencyContact ? req.body.emergencyContact : null,
		onSite: req.body.onSite !== undefined ? req.body.onSite : null,
		isBringingMinors: req.body.isBringingMinors !== undefined ? req.body.isBringingMinors : null,
		minorsNum: req.body.minorsNum !== undefined ? req.body.minorsNum : null,
		minorsNames: req.body.minorsNames ? req.body.minorsNames : null,
		miscComments: req.body.miscComments !== undefined ? req.body.miscComments : null,
		hasAcceptedCovidPolicy: req.body.hasAcceptedCovidPolicy !== undefined ? req.body.hasAcceptedCovidPolicy : null,
		verified: req.body.verified !== undefined ? req.body.verified : null
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

exports.resetPassword = async function (req, res, next) {
	try{
		let user
		if (req.body.user) {
			user = await UserService.getUserById(req.body.user)
		} else if (req.body.email) {
			user = await UserService.getUserByEmail(req.body.email)
		}

		if (!req.body.token) {
			// No token, generate new token and send email
			const newResetToken = crypto.randomBytes(16).toString('hex')
			const userChanges = {
				id: user._id,
				resetToken: newResetToken
			}
			let updatedUser = await UserService.updateUser(userChanges)

			return EmailService.sendPasswordResetEmail(updatedUser, req)
				.then((response) => {
					if (response.accepted.length > 0) {
						return res.status(201).json( {
							status: 201,
							message: 'Password reset request sent. Check your email for a message from ' +
								'rpglimitbreak@gmail.com. Be sure to check your spam folder if you can\'t find it in your inbox.'
						} )
					} else {
						return res.status(400).json( {
							status: 400,
							message: 'Something went wrong, try again later.'
						} )
					}
				})
		} else if (user.resetToken === req.body.token) {
			if (!req.body.new) {
				return res.status(400).json( {
					status: 400,
					message: 'No new password.'
				} )
			}

			const updatedUser = await UserService.updateUser({
				id: user._id,
				password: req.body.new
			})

			const token = generateToken(updatedUser)
			return res.status(200).json( {
				status: 200,
				user: user.username,
				token: token
			} )
		} else {
			return res.status(400).json( {
				status: 400,
				message: 'Invalid token.'
			} )
		}
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: `Password reset failed: ${e.message}`
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

			const token = generateToken(updatedUser)
			return res.status(200).json( {
				status: 200,
				user: user.username,
				token: token
			} )
		} else {
			throw Error()
		}
	} catch (e) {
		let message = 'Verification failed.'
		console.log(e)
		if (e.message.includes('while attempting to retrieve user information')) {
			message = 'User not found.'
		}
		return res.status(400).json( {
			status: 400,
			message: message
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
	if (!req.user || !req.user._id) {
		return res.status(400).json( {
			status: 400,
			message: 'Must be logged in to get user info.'
		} )
	}

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
