import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

const loginLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // limit each IP to 5 requests per windowMs
	message: 'Too many login attempts, please try again later',
	handler: (req, res, next, options) => {
		logger.warn(`Rate limit exceeded for ${req.ip}`);

		res.status(options.statusCode).send({
			statusCode: options.statusCode,
			message: options.message,
		});
	},
});

export default loginLimiter;
