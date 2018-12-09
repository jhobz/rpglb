const passport = require('passport')
const dbConfig = require('../config/database')
require('../config/passport')(passport)
const jwt = require('jsonwebtoken')

const GameSubmissionService = require('../services/game-submissions.service')

_this = this

exports.getSubmissions = async function (req, res, next) {
	// If user is logged in, check for admin status
	if (req.user) {
		// TODO: Grant additional privileges if admin
	}

	let page = req.query.page ? req.query.page : 1
	let limit = req.query.limit ? req.query.limit : 10

	try {
		let submissions = await GameSubmissionService.getSubmissions({}, page, limit)
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
		pros: req.body.pros,
		cons: req.body.cons,
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
		pros: req.body.pros ? req.body.pros : null,
		cons: req.body.cons ? req.body.cons : null,
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
