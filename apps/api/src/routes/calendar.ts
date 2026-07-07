import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  location: z.string().optional(),
  type: z.enum(['INTERVIEW', 'FOLLOWUP', 'DEADLINE', 'PERSONAL']),
});

router.get('/', async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const events = await prisma.calendarEvent.findMany({
      where: {
        userId: req.user!.userId,
        ...(start && end && { startAt: { gte: new Date(start as string), lte: new Date(end as string) } }),
      },
      orderBy: { startAt: 'asc' },
    });
    res.json(events);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = eventSchema.parse(req.body);
    const event = await prisma.calendarEvent.create({ data: { ...data, userId: req.user!.userId } });
    res.status(201).json(event);
  } catch (error) { next(error); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const event = await prisma.calendarEvent.updateMany({ where: { id: req.params.id, userId: req.user!.userId }, data: req.body });
    res.json(event);
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.calendarEvent.deleteMany({ where: { id: req.params.id, userId: req.user!.userId } });
    res.json({ message: 'Event deleted' });
  } catch (error) { next(error); }
});

export { router as calendarRouter };
