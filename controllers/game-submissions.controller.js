const passport = require('passport')
const dbConfig = require('../config/database')
require('../config/passport')(passport)
const jwt = require('jsonwebtoken')

const GameSubmissionService = require('../services/game-submissions.service')

_this = this

exports.getSubmissions = async function (req, res, next) {
	let query = { public: true }
	// If user is logged in, check for admin status
	if (req.user && (
		req.user.roles && req.user.roles.indexOf('submissions') >= 0 ||
		req.query.user && req.user._id == req.query.user )
	) {
		query = {}
	}

	// Get submissions for one runner specifically
	if (req.query.user) {
		query.runner = req.query.user
	}

	const page = req.query.page ? parseInt(req.query.page) : 1
	const limit = req.query.limit ? parseInt(req.query.limit) : 10
	const sort = req.query.sort ? req.query.sort : 'name'
	const order = req.query.order ? req.query.order : 'asc'

	try {
		let submissions = await GameSubmissionService.getSubmissions(query, page, limit, sort, order)
		return res.status(200).json( {
			status: 200,
			data: submissions,
			message: 'Submissions received successfully'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}

exports.createSubmission = async function (req, res, next) {
	// req.body contains the submitted form values

	let submission = {
		runner: req.body.runner,
		name: req.body.name,
		console: req.body.console,
		description: req.body.description,
		incentives: req.body.incentives,
		pros: req.body.pros,
		cons: req.body.cons,
		public: req.body.public,
		categories: req.body.categories
	}

	try {
		let createdSubmission = await GameSubmissionService.createSubmission(submission)
		return res.status(201).json( {
			status: 201,
			data: createdSubmission,
			message: 'Submission created successfully'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}

exports.updateSubmission = async function (req, res, next) {
	if (!req.body._id) {
		return res.status(400).json( {
			status: 400,
			message: 'id must be present to update submission'
		})
	}

	let id = req.body._id
	let submission = {
		id,
		runner: req.body.runner ? req.body.runner : null,
		name: req.body.name ? req.body.name : null,
		console: req.body.console ? req.body.console : null,
		description: req.body.description ? req.body.description : null,
		incentives: req.body.incentives ? req.body.incentives : null,
		pros: req.body.pros ? req.body.pros : null,
		cons: req.body.cons ? req.body.cons : null,
		public: req.body.public !== undefined ? req.body.public : null,
		categories: req.body.categories ? req.body.categories : null
	}

	try {
		let updatedSubmission = await GameSubmissionService.updateSubmission(submission)
		return res.status(200).json( {
			status: 200,
			data: updatedSubmission,
			message: 'Submission updated successfully'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}

exports.removeSubmission = async function (req, res, next) {
	let id = req.params.id

	try {
		let deleted = await GameSubmissionService.deleteSubmission(id)
		return res.status(204).json( {
			status: 204,
			message: 'Submission successfully deleted'
		} )
	} catch (e) {
		return res.status(400).json( {
			status: 400,
			message: e.message
		} )
	}
}
