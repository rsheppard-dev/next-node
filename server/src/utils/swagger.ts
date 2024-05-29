import { Express, Request, Response } from 'express';
import { version } from '../../package.json';
import { logger } from './logger';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsDoc.Options = {
	definition: {
		openapi: '3.1.0',
		info: {
			title: 'Secret Gifter API',
			version,
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: [`./src/routes/*.ts`, `./src/schemas/*.ts`],
};

const swaggerSpec = swaggerJsDoc(options);

export default function swaggerDocs(app: Express, port: number) {
	// swagger page
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	// swagger json
	app.get('/docs.json', (req: Request, res: Response) => {
		res.setHeader('Content-Type', 'application/json');
		console.log(options);
		res.send(swaggerSpec);
	});

	logger.info(`Swagger docs available at http://localhost:${port}/docs`);
}
