import { Response, Router } from 'express';
import sessionRoutes from './session.routes';
import userRoutes from './user.routes';
import groupRoutes from './group.routes';
import inviteRoutes from './invite.routes';

const router = Router();

/*
 * @openapi
 * /healthcheck:
 * get:
 * 	tag:
 * 		- Healthcheck
 * 		description: Responds if the application is running
 * 		responses:
 * 			200:
 * 				description: Application is running
 */
router.get('/healthcheck', (_, res: Response) => {
	res.sendStatus(200);
});

router.use('/api/sessions', sessionRoutes);
router.use('/api/users', userRoutes);
router.use('/api/groups', groupRoutes);
router.use('/api/invites', inviteRoutes);

export default router;
