import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId }, orderBy: { createdAt: 'desc' }, take: 50,
    });
    const unreadCount = await prisma.notification.count({ where: { userId: req.user!.userId, read: false } });
    res.json({ notifications, unreadCount });
  } catch (error) { next(error); }
});

router.patch('/:id/read', async (req, res, next) => {
  try {
    await prisma.notification.updateMany({ where: { id: req.params.id, userId: req.user!.userId }, data: { read: true } });
    res.json({ message: 'Notification marked as read' });
  } catch (error) { next(error); }
});

router.patch('/read-all', async (req, res, next) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user!.userId, read: false }, data: { read: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) { next(error); }
});

export { router as notificationsRouter };
