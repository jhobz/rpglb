const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

let UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	username: String,
	password: String
})

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema)

module.exports = User
