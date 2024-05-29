import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export default function validateResource(schema: AnyZodObject) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				params: req.params,
				query: req.query,
			});

			next();
		} catch (error: any) {
			res.status(400).send({
				statusCode: 400,
				message: error.errors,
			});
		}
	};
}
