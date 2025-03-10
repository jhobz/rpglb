// const passport = require('passport')
// require('../config/passport')(passport)

const SpeedrunEventService = require("../services/speedrun-events.service")

exports.getSpeedrunEvents = async function (req, res, next) {
    let page = req.query.page ? req.query.page : 1
    let limit = req.query.limit ? req.query.limit : 10

    try {
        let speedrunEvents = await SpeedrunEventService.getSpeedrunEvents(
            {},
            page,
            limit
        )
        return res.status(200).json({
            status: 200,
            data: speedrunEvents,
            message: "Speedrun events received successfully",
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: e.message,
        })
    }
}

exports.createSpeedrunEvent = async function (req, res, next) {
    if (
        !req.user ||
        !req.user._id ||
        !req.user.roles ||
        !req.user.roles.includes("admin")
    ) {
        console.warn(
            "Unauthorized speedrun event creation attempted",
            req.user,
            req.body
        )
        return res.status(401).json({
            status: 401,
            message:
                "Unauthorized. You do not have permission to create a speedrun event.",
        })
    }

    // req.body contains the submitted form values
    let speedrunEvent = {
        name: req.body.name,
        shortname: req.body.shortname,
        cause: req.body.cause, // TODO: Might need to update this more granularly
    }

    try {
        let createdSpeedrunEvent =
            await SpeedrunEventService.createSpeedrunEvent(speedrunEvent)
        return res.status(201).json({
            status: 201,
            data: createdSpeedrunEvent,
            message: "Speedrun event created successfully",
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: e.message,
        })
    }
}

exports.updateSpeedrunEvent = async function (req, res, next) {
    let id = req.body._id
    if (!id) {
        return res.status(400).json({
            status: 400,
            message: "id must be present to update speedrun event",
        })
    }

    if (!req.user || !req.user._id) {
        console.warn(
            "Unauthorized speedrun event editing attempted",
            req.user,
            req.body
        )
        return res.status(401).json({
            status: 401,
            message:
                "Unauthorized. You must be logged in to edit a speedrun event.",
        })
    }

    // TODO: Figure out how to implement event-specific admins
    // try {
    // 	let speedrunEventToUpdate = await SpeedrunEventService.getSpeedrunEventById(id)
    // 	let eventAdmins = speedrunEventToUpdate.admins
    // }
    const userRoles = req.user.roles

    if (
        !userRoles ||
        (!userRoles.includes("event") && !userRoles.includes("admin"))
    ) {
        console.warn(
            "Unauthorized speedrun event editing attempted",
            req.user,
            req.body
        )
        return res.status(401).json({
            status: 401,
            message:
                "Unauthorized. You do not have permission to edit this speedrun event.",
        })
    }

    let speedrunEvent = {
        _id: id,
        name: req.body.name ? req.body.name : null,
        shortname: req.body.shortname ? req.body.shortname : null,
        cause: req.body.cause ? req.body.cause : null,
        active: req.body.active,
        state: req.body.state ? req.body.state : null,
        areGameSubmissionsOpen: req.body.areGameSubmissionsOpen,
        arePrizeSubmissionsOpen: req.body.arePrizeSubmissionsOpen,
        areVolunteerSubmissionsOpen: req.body.areVolunteerSubmissionsOpen,
        isGamesListPublic: req.body.isGamesListPublic,
        isRegistrationOpen: req.body.isRegistrationOpen,
        maxRegisteredUsers: req.body.maxRegisteredUsers
            ? req.body.maxRegisteredUsers
            : null,
        registrationCost: req.body.registrationCost
            ? req.body.registrationCost
            : null,
        volunteerFormUrl: req.body.volunteerFormUrl
            ? req.body.volunteerFormUrl
            : null,
        hotelBookingUrl: req.body.volunteerFormUrl
            ? req.body.hotelBookingUrl
            : null,
        gameSubmissions: req.body.gameSubmissions
            ? req.body.gameSubmissions
            : null,
        volunteerSubmissions: req.body.volunteerSubmissions
            ? req.body.volunteerSubmissions
            : null,
        registeredUsers: req.body.registeredUsers
            ? req.body.registeredUsers
            : null,
        dates: req.body.dates ? req.body.dates : null,
    }

    if (userRoles.includes("admin")) {
        speedrunEvent.admins = req.body.admins ? req.body.admins : null
    }

    try {
        let updatedSpeedrunEvent =
            await SpeedrunEventService.updateSpeedrunEvent(speedrunEvent)
        return res.status(200).json({
            status: 200,
            data: updatedSpeedrunEvent,
            message: "Speedrun event updated successfully",
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: e.message,
        })
    }
}

exports.removeSpeedrunEvent = async function (req, res, next) {
    if (!req.user || !req.user.roles || !req.user.roles.includes("admin")) {
        console.warn(
            "Unauthorized speedrun event deletion attempted",
            req.user,
            req.body
        )
        return res.status(401).json({
            status: 401,
            message:
                "Unauthorized. You do not have permission to delete this speedrun event.",
        })
    }

    let id = req.params.id

    try {
        let deleted = await SpeedrunEventService.deleteSpeedrunEvent(id)
        return res.status(204).json({
            status: 204,
            message: "Speedrun event successfully deleted",
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: e.message,
        })
    }
}

exports.getSpeedrunEvent = async function (req, res, next) {
    try {
        let speedrunEvent = await SpeedrunEventService.getSpeedrunEventById(
            req.params.id
        )
        const prop = req.params.prop
        if (!prop) {
            return res.status(201).json({
                status: 201,
                data: speedrunEvent,
            })
        } else {
            return res.status(201).json({
                status: 201,
                [prop]: speedrunEvent[prop],
            })
        }
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Unable to retrieve speedrun event information.",
        })
    }
}

exports.getActiveSpeedrunEvent = async function (req, res, next) {
    try {
        let speedrunEvent = await SpeedrunEventService.getActiveSpeedrunEvent()
        // Activate async virtual so that it is passed through to client
        let json = speedrunEvent.toJSON()
        json.registeredUsersCount = await speedrunEvent.registeredUsersCount
        return res.status(201).json({
            status: 201,
            data: json,
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Unable to retrieve active speedrun event information.",
        })
    }
}
