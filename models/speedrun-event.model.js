const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")

let SpeedrunEventSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    shortname: {
        type: String,
        index: true,
        unique: true,
    },
    cause: {
        name: {
            type: String,
            trim: true,
        },
        url: {
            type: String,
            lowercase: true,
            trim: true,
            match: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
        },
        trackerId: Number,
    },
    active: Boolean,
    state: {
        type: String,
        lowercase: true,
        trim: true,
        enum: ["pre", "live", "post"],
        required: true,
    },
    areGameSubmissionsOpen: Boolean,
    arePrizeSubmissionsOpen: Boolean,
    areVolunteerSubmissionsOpen: Boolean,
    isGamesListPublic: Boolean,
    isRegistrationOpen: Boolean,
    maxRegisteredUsers: Number,
    registrationCost: Number,
    volunteerFormUrl: {
        type: String,
        trim: true,
        match: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
    },
    hotelBookingUrl: {
        type: String,
        trim: true,
        match: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
    },
    gameSubmissions: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "GameSubmission",
        },
    ],
    volunteerSubmissions: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "VolunteerSubmission",
        },
    ],
    registeredUsers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
    admins: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
})

SpeedrunEventSchema.virtual("registeredUsersCount").get(async function () {
    var query = await mongoose
        .model("User")
        .countDocuments({ roles: "attendee" })
    return query
})

SpeedrunEventSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("SpeedrunEvent", SpeedrunEventSchema)
