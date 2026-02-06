const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")
const bcrypt = require("bcrypt-nodejs")

let UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 32,
        required: true,
    },
    lastName: {
        type: String,
        maxlength: 32,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        maxlength: 64,
        trim: true,
        required: true,
        match: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    },
    username: {
        type: String,
        collation: {
            locale: "en_US",
            strength: 1,
        },
        unique: true,
        minlength: 3,
        maxlength: 26,
        trim: true,
        validate: {
            isAsync: true,
            validator: validateUnique("username"),
        },
        required: true,
        match: /^[A-Za-z0-9_]+$/i,
    },
    password: {
        type: String,
        minlength: 12,
        maxlength: 128,
        required: true,
    },
    resetToken: {
        type: String,
    },
    roles: {
        type: [String],
        default: [],
    },
    verificationToken: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
        required: true,
    },
    attendanceDates: {
        startDate: Date,
        endDate: Date,
    },
    submissions: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "GameSubmission",
        },
    ],
    twitch: {
        type: String,
        minlength: 3,
        maxlength: 26,
        trim: true,
    },
    twitter: {
        type: String,
        minlength: 3,
        maxlength: 128,
        trim: true,
    },
    discord: {
        type: String,
        minlength: 3,
        maxlength: 32,
        trim: true,
    },
    phone: {
        type: String,
        minlength: 8,
        maxlength: 26,
        trim: true,
    },
    pronouns: {
        type: String,
        maxlength: 26,
        trim: true,
    },
    shouldPrintPronouns: {
        type: Boolean,
        default: false,
    },
    emergencyContact: {
        name: {
            type: String,
            minlength: 1,
            maxlength: 128,
        },
        relationship: {
            type: String,
            minlength: 1,
            maxlength: 128,
        },
        phone: {
            type: String,
            minlength: 8,
            maxlength: 26,
        },
    },
    onSite: Boolean,
    isBringingMinors: Boolean,
    minorsNum: {
        type: Number,
        min: 0,
        max: 99,
    },
    minorsNames: {
        type: String,
        maxlength: 64,
    },
    miscComments: {
        type: String,
        maxlength: 560,
    },
    hasAcceptedCovidPolicy: Boolean,
})

function validateUnique(field) {
    return function (value, cb) {
        if (value && value.length) {
            var query = mongoose
                .model("User")
                .where(field, new RegExp("^" + value + "$", "i"))
            if (!this.isNew) {
                query = query.where("_id").ne(this._id)
            }
            query.count(function (err, n) {
                cb(n < 1)
            })
        } else {
            cb(false, "Error: username is not unique")
        }
    }
}

// Specifically have to NOT use arrow notation here (no access to `this`)
UserSchema.pre("save", function (next) {
    let user = this
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) {
                    return next(err)
                }
                user.password = hash
                next()
            })
        })
    } else {
        return next()
    }
})

// Specifically have to NOT use arrow notation here (no access to `this`)
UserSchema.methods.comparePassword = function (pass, cb) {
    bcrypt.compare(pass, this.password, (err, isMatch) => {
        if (err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

UserSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("User", UserSchema)
