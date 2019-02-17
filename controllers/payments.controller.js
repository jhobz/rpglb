require('dotenv').config()
const stripeSecret = process.env.STRIPE_SECRET
const stripe = require('stripe')(stripeSecret)
const PaymentService = require('../services/payments.service')

exports.getPayments = async function (req, res, next) {
	let page = req.query.page ? req.query.page : 1
	let limit = req.query.limit ? req.query.limit : 10

	try {
		let payments = await PaymentService.getPayments({}, page, limit)
		return res.status(200).json( {
			status: 200,
			data: payments,
			message: 'Payments received successfully'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}

exports.createPayment = async function (req, res, next) {
	if (!req.user || !req.user._id) {
		console.warn('Unauthorized payment creation attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You do not have permission to create a payment.'
		} )
	}

	// req.body contains the submitted form values
	let payment = {
		user: req.user._id,
		stripeToken: req.body.token,
		stripeEmail: req.body.email,
		amount: req.body.amount,
		fulfilled: false
	}

	try {
		let createdPayment = await PaymentService.createPayment(payment)

		let amount = payment.amount * 100
		let stripeCustomer = await stripe.customers.create({
			email: payment.email,
			source: payment.stripeToken
		})
		let stripeCharge = await stripe.charges.create({
			amount,
			description: 'Sample Charge',
			currency: 'usd',
			customer: stripeCustomer.id
		})

		let updatedPayment = await PaymentService.updatePayment({
			_id: createdPayment._id,
			fulfilled: true
		})

		return res.status(201).json( {
			status: 201,
			data: updatedPayment,
			message: 'Payment charged successfully'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}

exports.updatePayment = async function (req, res, next) {
	let id = req.body._id
	if (!id) {
		return res.status(400).json( {
			status: 400,
			message: 'id must be present to update payment'
		})
	}

	if (!req.user || !req.user._id) {
		console.warn('Unauthorized payment editing attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You must be logged in to edit a payment.'
		} )
	}

	let payment = {
		_id: id,
		user: req.user._id,
		stripeToken: req.body.stripeToken ? req.body.stripeToken : null,
		amount: req.body.amount !== undefined ? req.body.amount : null,
		fulfilled: req.body.fulfilled !== undefined ? req.body.fulfilled : null
	}

	try {
		let updatedPayment = await PaymentService.updatePayment(payment)
		return res.status(200).json( {
			status: 200,
			data: updatedPayment,
			message: 'Payment updated successfully'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}

exports.removePayment = async function (req, res, next) {
	if (!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
		console.warn('Unauthorized payment deletion attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You do not have permission to delete this payment.'
		} )
	}

	let id = req.params.id

	try {
		let deleted = await PaymentService.deletePayment(id)
		return res.status(204).json( {
			status: 204,
			message: 'Payment successfully deleted'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}
