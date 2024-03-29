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
		maxlength: 560 // Pitch it in 2 tweets or less
	},
	selectionStatus: {
		type: Number,
		default: 0, // 0 = reject, 1 = accept, 2 = backup, 3 = bonus
		min: 0,
		max: 3,
		required: true
	},
	selectionComment: {
		type: String,
		trim: true,
		maxlength: 560
	},
	video: {
		type: String, // URL
		trim: true,
		required: true,
		maxlength: 500,
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
		maxlength: 1120,
		required: true
	},
	incentives: {
		type: String,
		trim: true,
		maxlength: 560
	},
	pros: {
		type: String,
		trim: true,
		maxlength: 560
	},
	cons: {
		type: String,
		trim: true,
		maxlength: 560
	},
	public: {
		type: Boolean,
		default: false
	},
	availability: {
		type: String,
		trim: true,
		maxlength: 64,
		required: true
	},
	isRemote: {
		type: Boolean,
		default: false
	},
	uploadBandwidth: {
		type: String,
		trim: true,
		maxlength: 64
	},
	techNotes: {
		type: String,
		trim: true,
		maxlength: 560
	},
	categories: {
		type: [CategorySchema],
		validate: [numCategoriesValidator, '{PATH} either has too few or too many items'],
		required: true
	},
	speedrunEvent: {
		type: mongoose.Schema.ObjectId,
		ref: 'SpeedrunEvent',
		required: true
	}
})

function numCategoriesValidator(arr) {
	return arr.length > 0 && arr.length <= 5
}

GameSubmissionSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('GameSubmission', GameSubmissionSchema)
