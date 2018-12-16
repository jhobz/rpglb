const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

let CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		maxlength: 64,
		required: true
	},
	estimate: {
		type: Number, // Duration, in minutes
		min: 1,
		max: 10080, // One week
		required: true
	},
	description: {
		type: String,
		trim: true,
		maxlength: 240, // Pitch it in 2 tweets or less
		require: true
	},
	video: {
		type: String, // URL
		trim: true,
		require: true,
		match: /^(?:http(s)?:\/\/(?:www\.)?)?(?:\w+\.\w+)+\/\S+$/i
	}
})

let GameSubmissionSchema = new mongoose.Schema({
	runner: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	name: {
		type: String,
		maxlength: 64,
		required: true
	},
	console: {
		type: String,
		maxlength: 32,
		required: true
	},
	description: {
		type: String,
		trim: true,
		maxlength: 500,
		require: true
	},
	pros: {
		type: String,
		trim: true,
		maxlength: 500
	},
	cons: {
		type: String,
		trim: true,
		maxlength: 500
	},
	public: {
		type: Boolean,
		default: false
	},
	categories: {
		type: [CategorySchema],
		required: true
	}
})

GameSubmissionSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('GameSubmission', GameSubmissionSchema)
