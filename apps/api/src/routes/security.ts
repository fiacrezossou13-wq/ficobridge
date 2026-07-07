import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

router.get('/logs', async (req, res, next) => {
  try {
    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user!.userId }, orderBy: { createdAt: 'desc' }, take: 100,
    });
    res.json(logs);
  } catch (error) { next(error); }
});

router.get('/sessions', async (req, res, next) => {
  try {
    res.json({ sessions: [{ id: 'current', device: 'Current Browser', lastActive: new Date() }] });
  } catch (error) { next(error); }
});

export { router as securityRouter };
