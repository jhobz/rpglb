const nodemailer = require('nodemailer')
require('dotenv').config()

_this = this

const transporter = nodemailer.createTransport({
	service: 'SendGrid',
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
}, {
	from: 'no-reply@communication.rpglimitbreak.com',
	replyTo: 'rpglimitbreak@gmail.com'
})

generateBaseUrl = function (req) {
	return `${req.protocol}://${process.env.NODE_ENV === 'development' ? 'localhost:4200' : 'rpglimitbreak.com'}`
}

exports.sendVerificationEmail = function (user, req) {
	const baseUrl = generateBaseUrl(req)
	const url = `${baseUrl}/verify?user=${user._id}&token=${user.verificationToken}`

	const mailOptions = {
		to: user.email,
		subject: 'Verify your RPGLB account',
		html: `
			<h1>RPG Limit Break</h1>
			<p>Click this link to verify your email: <a href="${url}">Verify email address</a></p>
			<p>If the link above doesn't work, copy and paste the following URL into your browser:</p>
			<p>${url}</p>`
	}

	return transporter.sendMail(mailOptions)
}

exports.sendPasswordResetEmail = function (user, req) {
	const baseUrl = generateBaseUrl(req)
	const url = `${baseUrl}/reset?user=${user._id}&token=${user.resetToken}`

	const mailOptions = {
		to: user.email,
		subject: 'Reset your RPGLB password',
		html: `
			<h1>RPG Limit Break</h1>
			<p>You recently requested a password reset for your account "${user.username}" at ${baseUrl}. If you
			did not request a password reset, or if you simply forgot your username, no action is needed.</p>
			<p>Otherwise, click this link to reset your password: <a href="${url}">Reset password</a></p>
			<p>If you cannot click the link above, copy and paste the following URL into your browser:</p>
			<p>${url}</p>`
	}

	return transporter.sendMail(mailOptions)
}
