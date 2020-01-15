const passport = require('passport')
const dbConfig = require('../config/database')
require('../config/passport')(passport)
const jwt = require('jsonwebtoken')

const GameSubmissionService = require('../services/game-submissions.service')
const SpeedrunEventService = require('../services/speedrun-events.service')

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

	// Get submissions for one event specifically
	if (req.query.speedrunEvent) {
		query.speedrunEvent = req.query.speedrunEvent
	}

	let statusArray = []
	if (req.query.selection) {
		let selectionQuery = req.query.selection
		selectionQuery = selectionQuery.replace('decline', 0).replace('accept', 1).replace('backup', 2).replace('bonus', 3)
		statusArray = selectionQuery.split(' ')
		query['categories.selectionStatus'] = { $in: statusArray }
	}

	const page = req.query.page ? parseInt(req.query.page) : 1
	const limit = req.query.limit ? parseInt(req.query.limit) : 10
	const sort = req.query.sort ? req.query.sort : 'name'
	const order = req.query.order ? req.query.order : 'asc'

	try {
		let submissions = await GameSubmissionService.getSubmissions(query, page, limit, sort, order)
		if (statusArray.length) {
			submissions.docs.forEach(doc => {
				doc.categories = doc.categories.filter(cat => {
					return statusArray.includes(cat.selectionStatus.toString())
				})
			})
		}
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
	if (!req.user) {
		console.warn('Unauthorized submission creation attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You must be logged in to create a submission.'
		} )
	}

	if (req.user._id != req.body.runner) {
		console.warn('Unauthorized submission creation attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You may not create a submission for this user.'
		} )
	}

	let activeEvent = await SpeedrunEventService.getActiveSpeedrunEvent()
	if (!activeEvent || !activeEvent.areGameSubmissionsOpen &&
		(!req.user.roles || !req.user.roles.includes('submissions') || !req.user.roles.includes('admin'))
	) {
		console.warn('Unauthorized submission creation attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: `Unauthorized. Game submissions for ${activeEvent.name} are currently closed.`
		} )
	}

	let submission = {
		runner: req.body.runner,
		name: req.body.name,
		console: req.body.console,
		description: req.body.description,
		incentives: req.body.incentives,
		pros: req.body.pros,
		cons: req.body.cons,
		public: req.body.public,
		selectionStatus: req.body.selectionStatus,
		selectionComment: req.body.selectionComment,
		categories: req.body.categories,
		speedrunEvent: activeEvent.id
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

	if (!req.user) {
		console.warn('Unauthorized submission editing attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You must be logged in to edit a submission.'
		} )
	}

	if (req.user._id != req.body.runner && (
		!req.user.roles || req.user.roles.indexOf('submissions') === -1
	)) {
		console.warn('Unauthorized submission editing attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You do not have permission to edit this user\'s submission.'
		} )
	}

	let activeEvent = await SpeedrunEventService.getActiveSpeedrunEvent()
	if (!activeEvent.areGameSubmissionsOpen &&
		(!req.user.roles || !(req.user.roles.includes('submissions') || req.user.roles.includes('admin')))
	) {
		console.warn('User attempted to update submission after submissions closed.', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: `Unauthorized. Game submissions for ${activeEvent.name} are currently closed.`
		} )
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
		selectionStatus: req.body.selectionStatus !== undefined ? req.body.selectionStatus : null,
		selectionComment: req.body.selectionComment ? req.body.selectionComment : null,
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
	if (!req.user) {
		console.warn('Unauthorized submission deletion attempted', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You must be logged in to delete a submission.'
		} )
	}

	let id = req.params.id
	let submission = await GameSubmissionService.getSubmissionById(id)

	if (req.user.id != submission.runner && (
		!req.user.roles || !req.user.roles.includes('submissions'))
	) {
		console.warn('Unauthorized submission deletion attempted', req.user, submission)
		return res.status(401).json( {
			status: 401,
			message: 'Unauthorized. You do not have permission to delete this user\'s submission.'
		} )
	}

	let activeEvent = await SpeedrunEventService.getActiveSpeedrunEvent()
	if (!activeEvent.areGameSubmissionsOpen &&
		(!req.user.roles || !req.user.roles.includes('submissions') || !req.user.roles.includes('admin'))
	) {
		console.warn('Submission deletion attempted while submissions are closed', req.user, req.body)
		return res.status(401).json( {
			status: 401,
			message: `Unauthorized. Game submissions for ${activeEvent.name} are currently closed.`
		} )
	}

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
