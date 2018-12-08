const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const bcrypt = require('bcrypt-nodejs')

let UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		require: true
	},
	username: {
		type: String,
		unique: true,
		require: true
	},
	password: {
		type: String,
		required: true
	}
})

// Specifically have to NOT use arrow notation here (no access to `this`)
UserSchema.pre('save', function (next) {
	let user = this
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				return next(err)
			}
			bcrypt.hash(user.password, salt, null, (err, hash) => {
				if (err) {
					return next(err)
				}
				user.password = hash
				next()
			})
		})
	} else {
		return next()
	}
})

// Specifically have to NOT use arrow notation here (no access to `this`)
UserSchema.methods.comparePassword = function (pass, cb) {
	bcrypt.compare(pass, this.password, (err, isMatch) => {
		if (err) {
			return cb(err)
		}
		cb(null, isMatch)
	})
}

UserSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('User', UserSchema)
