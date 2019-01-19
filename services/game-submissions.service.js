let GameSubmission = require('../models/game-submission.model')

_this = this

exports.getSubmissions = async function (query, page, limit, sort, order) {
	// options for mongoose paginate
	let options = {
		page,
		limit,
		sort: { [sort]: order }
	}

	// try-catch for db query
	try {
		let submissions = await GameSubmission.paginate(query, options)
		return submissions
	} catch (e) {
		throw Error(`Error while paginating submissions: ${e.message}`)
	}
}

exports.createSubmission = async function (submission) {
	let newSubmission = new GameSubmission({
		runner: submission.runner,
		name: submission.name,
		console: submission.console,
		description: submission.description,
		incentives: submission.incentives,
		pros: submission.pros,
		cons: submission.cons,
		public: submission.public,
		categories: submission.categories
	})

	try {
		let savedSubmission = await newSubmission.save()
		return savedSubmission
	} catch (e) {
		throw Error(`Error while attempting to save new submission: ${e.message}`)
	}
}

exports.updateSubmission = async function (submission) {
	let id = submission.id
	let oldSubmission

	try {
		oldSubmission = await GameSubmission.findById(id)
	} catch (e) {
		throw Error(`Error occurred while finding submission: ${e.message}`)
	}

	// submission doesn't exist or error was thrown
	if (!oldSubmission) {
		return false
	}

	// Replace any changed values
	Object.keys(submission).forEach(key => {
		if (submission[key] || key === 'public') {
			oldSubmission[key] = submission[key]
		}
	})

	try {
		let savedSubmission = await oldSubmission.save()
		return savedSubmission
	} catch (e) {
		throw Error(`Error occurred while updating submission: ${e.message}`)
	}
}

exports.deleteSubmission = async function (id) {
	try {
		let deleted = await GameSubmission.deleteOne({ _id: id })
		if (deleted.n === 0) {
			throw Error('Submission could not be deleted')
		}
		return deleted
	} catch (e) {
		throw Error(`Error occurred while attempting to delete submission: ${e.message}`)
	}
}

// ???: Should I add a `getSubmissionsByUsername` method?

// Get a single submission by user search
exports.getSubmissionsByUser = async function (user) {
	try {
		let submission = await GameSubmission.findOne({ runner: user._id })
		return submission
	} catch (e) {
		throw Error(`Error occurred while attempting to retrieve submission: ${e.message}`)
	}
}
