let User = require('../models/user.model')
const crypto = require('crypto')

_this = this

exports.getUsers = async function (query, page, limit) {
	// options for mongoose paginate
	let options = {
		page,
		limit
	}

	// try-catch for db query
	try {
		let users = await User.paginate(query, options)
		return users
	} catch (e) {
		throw Error(`Error while paginating users: ${e.message}`)
	}
}

exports.createUser = async function (user) {
	let newUser = new User({
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		username: user.username,
		password: user.password,
		verified: false,
		verificationToken: crypto.randomBytes(16).toString('hex')
	})

	try {
		let savedUser = await newUser.save()
		return savedUser
	} catch (e) {
		throw Error(`Error while attempting to save new user: ${e.message}`)
	}
}

exports.updateUser = async function (user) {
	let id = user.id
	let oldUser

	try {
		oldUser = await User.findById(id)
	} catch (e) {
		throw Error(`Error occurred while finding user: ${e.message}`)
	}

	// user doesn't exist or error was thrown
	if (!oldUser) {
		return false
	}

	// Replace any changed values
	Object.keys(user).forEach(key => {
		if (user[key] || key === 'verified') {
			oldUser[key] = user[key]
		}
	})

	try {
		let savedUser = await oldUser.save()
		return savedUser
	} catch (e) {
		throw Error(`Error occurred while updating user: ${e.message}`)
	}
}

exports.deleteUser = async function (id) {
	try {
		let deleted = await User.deleteOne({ _id: id })
		if (deleted.n === 0) {
			throw Error('User could not be deleted')
		}
		return deleted
	} catch (e) {
		throw Error(`Error occurred while attempting to delete user: ${e.message}`)
	}
}

// Get a single user by username search
exports.getUser = async function (username) {
	try {
		let user = await User.findOne({ username: username })
		return user
	} catch (e) {
		throw Error(`Error occurred while attempting to retrieve user information: ${e.message}`)
	}
}

exports.getUserById = async function (id) {
	try {
		let user = await User.findOne({ _id: id })
		return user
	} catch (e) {
		throw Error(`Error occurred while attempting to retrieve user information: ${e.message}`)
	}
}
