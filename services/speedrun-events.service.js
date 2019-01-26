let SpeedrunEvent = require('../models/speedrun-event.model')

_this = this

exports.getSpeedrunEvents = async function (query, page, limit) {
	// options for mongoose paginate
	let options = {
		page,
		limit
	}

	// try-catch for db query
	try {
		let speedrunEvents = await SpeedrunEvent.paginate(query, options)
		return speedrunEvents
	} catch (e) {
		throw Error(`Error while paginating speedrunEvents: ${e.message}`)
	}
}

exports.createSpeedrunEvent = async function (speedrunEvent) {
	let newSpeedrunEvent = new SpeedrunEvent({
		name: speedrunEvent.name,
		shortname: speedrunEvent.shortname,
		cause: speedrunEvent.cause, // TODO: Might have to assign parts of the object individually here
		active: false,
		state: 'pre'
	})

	try {
		let savedSpeedrunEvent = await newSpeedrunEvent.save()
		return savedSpeedrunEvent
	} catch (e) {
		throw Error(`Error while attempting to save new speedrun event: ${e.message}`)
	}
}

exports.updateSpeedrunEvent = async function (speedrunEvent) {
	let id = speedrunEvent._id
	let oldSpeedrunEvent

	try {
		oldSpeedrunEvent = await SpeedrunEvent.findById(id)
	} catch (e) {
		throw Error(`Error occurred while finding speedrun event: ${e.message}`)
	}

	// speedrunEvent doesn't exist or error was thrown
	if (!oldSpeedrunEvent) {
		return false
	}

	// Replace any changed values
	Object.keys(speedrunEvent).forEach(key => {
		if (speedrunEvent[key] || typeof speedrunEvent[key] === 'boolean') {
			oldSpeedrunEvent[key] = speedrunEvent[key]
		}
	})

	try {
		let savedSpeedrunEvent = await oldSpeedrunEvent.save()
		return savedSpeedrunEvent
	} catch (e) {
		throw Error(`Error occurred while updating speedrun event: ${e.message}`)
	}
}

exports.deleteSpeedrunEvent = async function (id) {
	try {
		let deleted = await SpeedrunEvent.deleteOne({ _id: id })
		if (deleted.n === 0) {
			throw Error('SpeedrunEvent could not be deleted')
		}
		return deleted
	} catch (e) {
		throw Error(`Error occurred while attempting to delete speedrun event: ${e.message}`)
	}
}

// Get a single speedrunEvent by name search
exports.getSpeedrunEvent = async function (name) {
	try {
		let speedrunEvent = await SpeedrunEvent.findOne({ name: name })
		return speedrunEvent
	} catch (e) {
		throw Error(`Error occurred while attempting to retrieve speedrun event information: ${e.message}`)
	}
}

exports.getActiveSpeedrunEvent = async function (name) {
	try {
		let speedrunEvent = await SpeedrunEvent.findOne({ active: true })
		return speedrunEvent
	} catch (e) {
		throw Error(`Error occurred while attempting to retrieve speedrun event information: ${e.message}`)
	}
}

exports.getSpeedrunEventById = async function (id) {
	try {
		let speedrunEvent = await SpeedrunEvent.findById(id)
		return speedrunEvent
	} catch (e) {
		throw Error(`Error occurred while attempting to retrieve speedrun event information: ${e.message}`)
	}
}
