let Payment = require('../models/payment.model')

_this = this

exports.getPayments = async function (query, page, limit) {
	// options for mongoose paginate
	let options = {
		page,
		limit
	}

	// try-catch for db query
	try {
		let payments = await Payment.paginate(query, options)
		return payments
	} catch (e) {
		throw Error(`Error while paginating payments: ${e.message}`)
	}
}

exports.createPayment = async function (payment) {
	let newPayment = new Payment({
		user: payment.user,
		stripeToken: payment.stripeToken,
		stripeEmail: payment.stripeEmail,
		amount: payment.amount,
		fulfilled: false
	})

	try {
		let savedPayment = await newPayment.save()
		return savedPayment
	} catch (e) {
		throw Error(`Error while attempting to save new payment: ${e.message}`)
	}
}

exports.updatePayment = async function (payment) {
	let id = payment._id
	let oldPayment

	try {
		oldPayment = await Payment.findById(id)
	} catch (e) {
		throw Error(`Error occurred while finding payment: ${e.message}`)
	}

	// payment doesn't exist or error was thrown
	if (!oldPayment) {
		return false
	}

	// Replace any changed values
	Object.keys(payment).forEach(key => {
		if (payment[key] || typeof payment[key] === 'boolean') {
			oldPayment[key] = payment[key]
		}
	})

	try {
		let savedPayment = await oldPayment.save()
		return savedPayment
	} catch (e) {
		throw Error(`Error occurred while updating payment: ${e.message}`)
	}
}

exports.deletePayment = async function (id) {
	try {
		let deleted = await Payment.deleteOne({ _id: id })
		if (deleted.n === 0) {
			throw Error('Payment could not be deleted')
		}
		return deleted
	} catch (e) {
		throw Error(`Error occurred while attempting to delete payment: ${e.message}`)
	}
}

exports.getPaymentById = async function (id) {
	try {
		let payment = await Payment.findById(id)
		return payment
	} catch (e) {
		throw Error(`Error occurred while attempting to retrieve payment information: ${e.message}`)
	}
}
