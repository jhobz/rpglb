const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const bcrypt = require('bcrypt-nodejs')

let UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		maxlength: 32,
		required: true
	},
	lastName: {
		type: String,
		maxlength: 32,
		required: true
	},
	email: {
		type: String,
		unique: true,
		maxlength: 64,
		trim: true,
		lowercase: true,
		required: true,
		match: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
	},
	username: {
		type: String,
		collation: {
			locale: 'en',
			strength: 1
		},
		unique: true,
		minlength: 3,
		maxlength: 26,
		trim: true,
		required: true,
		match: /^[A-Za-z0-9_]+$/i
	},
	password: {
		type: String,
		minlength: 12,
		maxlength: 128,
		required: true
	},
	roles: {
		type: [String],
		default: []
	},
	verificationToken: {
		type: String
	},
	verified: {
		type: Boolean,
		default: false,
		required: true
	},
	submissions: [{
		type: mongoose.Schema.ObjectId,
		ref: 'GameSubmission'
	}]
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
