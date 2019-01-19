const AnonymousStrategy = require('passport-anonymous').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// load user model
const User = require('../models/user.model')

// db configuration settings
// TODO: probably make this depend on environment and use env vars in production
const dbConfig = require('../config/database')

module.exports = (passport) => {
	let opts = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: dbConfig.secret
	}

	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		User.findOne({_id: jwt_payload._id}, (err, user) => {
			if (err) {
				return done(err, false)
			}
			if (user) {
				return done(null, user)
			}
			return done (null, false)
		})
	}))

	passport.use(new AnonymousStrategy())
}
