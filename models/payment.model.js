const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

let PaymentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	stripeToken: {
		type: String,
		maxlength: 256,
		required: true
	},
	stripeEmail: {
		type: String,
		maxlength: 256
	},
	amount: {
		type: Number,
		min: 0,
		max: 5000,
		required: true
	},
	fulfilled: {
		type: Boolean,
		default: false,
		required: true
	}
})

PaymentSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Payment', PaymentSchema)
