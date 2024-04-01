import nodemailer, { SendMailOptions } from 'nodemailer';
import { env } from '../../config/env';
import { logger } from './logger';

// (async function createTestCredentials() {
// 	const credentials = await nodemailer.createTestAccount();
// 	console.log({ credentials });
// })();

const transporter = nodemailer.createTransport({
	host: env.MAIL_HOST,
	port: env.MAIL_PORT,
	secure: false,
	auth: {
		user: env.MAIL_USER,
		pass: env.MAIL_PASSWORD,
	},
});

export default async function sendEmail(payload: SendMailOptions) {
	transporter.sendMail(payload, (error, info) => {
		if (error) {
			logger.error(error, 'Error sending email');
			return;
		}

		logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
	});
}
