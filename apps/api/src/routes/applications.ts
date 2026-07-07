import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();
router.use(authenticate);

const applicationSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  city: z.string().min(1),
  sector: z.string().min(1),
  contractType: z.enum(['ALTERNANCE', 'STAGE', 'CDD', 'CDI', 'FREELANCE']),
  salary: z.string().optional(),
  platform: z.string().min(1),
  offerUrl: z.string().url().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
});

router.get('/', async (req, res, next) => {
  try {
    const { status, search, sortBy = 'sentAt', order = 'desc' } = req.query;
    const where: any = { userId: req.user!.userId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { company: { contains: search as string, mode: 'insensitive' } },
        { position: { contains: search as string, mode: 'insensitive' } },
        { city: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const applications = await prisma.application.findMany({
      where, orderBy: { [sortBy as string]: order },
      include: { documents: true, history: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    res.json({ applications, count: applications.length });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const application = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
      include: { documents: true, history: { orderBy: { createdAt: 'desc' } } },
    });
    if (!application) throw new AppError('Application not found', 404);
    res.json(application);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = applicationSchema.parse(req.body);
    const application = await prisma.application.create({
      data: { ...data, userId: req.user!.userId },
      include: { documents: true },
    });
    await prisma.applicationHistory.create({
      data: { applicationId: application.id, action: 'CREATED', details: 'Candidature créée' },
    });
    logger.info(`Application created: ${application.company} by ${req.user!.email}`);
    res.status(201).json(application);
  } catch (error) { next(error); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { status, ...data } = req.body;
    const existing = await prisma.application.findFirst({ where: { id: req.params.id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Application not found', 404);
    const application = await prisma.application.update({ where: { id: req.params.id }, data: { ...data, ...(status && { status }) } });
    if (status && status !== existing.status) {
      await prisma.applicationHistory.create({
        data: { applicationId: application.id, action: 'STATUS_CHANGED', details: `Statut changé de ${existing.status} à ${status}` },
      });
    }
    res.json(application);
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.application.findFirst({ where: { id: req.params.id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Application not found', 404);
    await prisma.application.delete({ where: { id: req.params.id } });
    res.json({ message: 'Application deleted' });
  } catch (error) { next(error); }
});

export { router as applicationsRouter };
