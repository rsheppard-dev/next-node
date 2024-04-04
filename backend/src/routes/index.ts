import { Router } from 'express';
import sessionRoutes from './session.routes';
import userRoutes from './user.routes';
import groupRoutes from './group.routes';

const router = Router();

router.get('/healthcheck', (_, res) => {
	res.sendStatus(200);
});

router.use('/api/sessions', sessionRoutes);
router.use('/api/users', userRoutes);
router.use('/api/groups', groupRoutes);

export default router;
