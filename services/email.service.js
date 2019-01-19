const nodemailer = require('nodemailer')
require('dotenv').config()

_this = this

exports.sendVerificationEmail = function (user, req) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		}
	})

	const mailOptions = {
		from: 'jeffrey296@gmail.com',//'rpglimitbreak@gmail.com',
		to: user.email,
		subject: 'Verify your RPGLB account',
		html: `
			<h1>RPG Limit Break</h1>
			<p>Click this link to verify your email:
			<a href="${req.protocol}://${process.env.NODE_ENV === 'development' ? 'localhost:4200' : req.get('host')}/verify?user=${user._id}&token=${user.verificationToken}">
			Verify email address</a></p>`
	}

	return transporter.sendMail(mailOptions)
}
