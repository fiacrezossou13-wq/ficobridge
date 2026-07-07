import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user!.userId }, orderBy: { createdAt: 'desc' },
    });
    res.json(documents);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, type, url, size, applicationId } = req.body;
    const document = await prisma.document.create({
      data: { name, type, url, size, userId: req.user!.userId, applicationId },
    });
    res.status(201).json(document);
  } catch (error) { next(error); }
});

export { router as documentsRouter };
