const nodemailer = require("nodemailer")
require("dotenv").config()

_this = this

const transporter = nodemailer.createTransport(
    {
        host: "smtp.resend.com",
        secure: true,
        port: 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },
    {
        from: "RPG Limit Break <website@rpglimitbreak.com>",
    }
)

generateBaseUrl = function (req) {
    return `${req.protocol}://${
        process.env.NODE_ENV === "development"
            ? "localhost:4200"
            : "rpglimitbreak.com"
    }`
}

exports.sendVerificationEmail = async function (user, req) {
    if (!user) {
        throw new Error("User not found.")
    }
    const baseUrl = generateBaseUrl(req)
    const url = `${baseUrl}/verify?user=${user._id}&token=${user.verificationToken}`

    const mailOptions = {
        to:
            process.env.NODE_ENV === "development"
                ? process.env.SMTP_TEST_EMAIL
                : user.email,
        subject: "Verify your RPGLB account",
        html: `
			<div
				style="
					display: grid;
					margin: 2rem auto;
					place-content: center;
					text-align: center;
					max-width: 800px;
					font-family: Roboto, Arial, sans-serif;
				"
			>
				<img
					src="https://rpglimitbreak.com/assets/images/logos/LimitBreak-new-logo-01.png"
					alt="RPG Limit Break logo"
					width="800"
				/>
				<h1>Verify your RPGLB account</h1>
				<p>
					Please click the link below to verify the email address associated
					with your account.
				</p>

				<div style="margin: 0 auto; text-align: center">
					<a
						href="${url}"
						style="
							display: inline-block;
							background-color: #1976d2;
							color: white;
							padding: 15px 35px;
							font-size: 1.2rem;
							text-decoration: none;
						"
						>Verify my email</a
					>
				</div>

				<p>
					If the link above doesn't work, copy and paste the following URL
					into your browser:
				</p>
				<a
					href="${url}"
					style="
						display: inline-block;
						background: rgb(48, 48, 48);
						padding: 1rem;
						border-radius: 5px;
						color: #ffab40;
					"
				>
					${url}
				</a>
			</div>`,
    }

    return transporter.sendMail(mailOptions)
}

exports.sendPasswordResetEmail = async function (user, req) {
    const baseUrl = generateBaseUrl(req)
    const url = `${baseUrl}/reset?user=${user._id}&token=${user.resetToken}`

    const mailOptions = {
        to:
            process.env.NODE_ENV === "development"
                ? process.env.SMTP_TEST_EMAIL
                : user.email,
        subject: "Reset your RPGLB password",
        html: `
			<div
				style="
					display: grid;
					margin: 2rem auto;
					place-content: center;
					text-align: center;
					max-width: 800px;
					font-family: Roboto, Arial, sans-serif;
				"
			>
				<img
					src="https://rpglimitbreak.com/assets/images/logos/LimitBreak-new-logo-01.png"
					alt="RPG Limit Break logo"
					width="800"
				/>
				<h1>Password reset requested</h1>
				<p>
					You recently requested a password reset for your account "${user.username}" at ${baseUrl}. If you
					did not request a password reset, or if you simply forgot your username, no action is needed.
				</p>
				<p>Otherwise, click the link below to reset your password.</p>
				<div style="margin: 0 auto; text-align: center">
					<a
						href="${url}"
						style="
							display: inline-block;
							background-color: #1976d2;
							color: white;
							padding: 15px 35px;
							font-size: 1.2rem;
							text-decoration: none;
						"
						>Reset password</a
					>
				</div>
				<p>
					If you cannot click the link above, copy and paste the following URL
					into your browser:
				</p>
				<a
					href="${url}"
					style="
						display: inline-block;
						background: rgb(48, 48, 48);
						padding: 1rem;
						border-radius: 5px;
						color: #ffab40;
					"
				>
					${url}
				</a>
			</div>`,
    }

    return transporter.sendMail(mailOptions)
}
