import express from 'express';
import auth from './auth.routes';
import user from './user.routes';
import group from './group.routes';

const router = express.Router();

router.get('/healthcheck', (_, res) => {
	res.sendStatus(200);
});

router.use('/api/auth', auth);
router.use('/api/users', user);
router.use('/api/groups', group);

export default router;
