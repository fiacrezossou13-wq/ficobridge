import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks } from 'date-fns';

const router = Router();
router.use(authenticate);

router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const total = await prisma.application.count({ where: { userId } });
    const sent = await prisma.application.count({ where: { userId, status: 'SENT' } });
    const followup = await prisma.application.count({ where: { userId, status: 'FOLLOWUP' } });
    const interview = await prisma.application.count({ where: { userId, status: 'INTERVIEW' } });
    const offer = await prisma.application.count({ where: { userId, status: 'OFFER' } });
    const accepted = await prisma.application.count({ where: { userId, status: 'ACCEPTED' } });
    const rejected = await prisma.application.count({ where: { userId, status: 'REJECTED' } });
    const ghosted = await prisma.application.count({ where: { userId, status: 'GHOSTED' } });

    const responseRate = total > 0 ? ((interview + offer + accepted + rejected) / total * 100).toFixed(1) : '0';
    const successRate = total > 0 ? ((offer + accepted) / total * 100).toFixed(1) : '0';

    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const thisWeek = await prisma.application.count({ where: { userId, sentAt: { gte: weekStart, lte: weekEnd } } });
    const thisMonth = await prisma.application.count({ where: { userId, sentAt: { gte: monthStart, lte: monthEnd } } });

    const sectorStats = await prisma.application.groupBy({ by: ['sector'], where: { userId }, _count: { sector: true } });
    const cityStats = await prisma.application.groupBy({ by: ['city'], where: { userId }, _count: { city: true } });

    const timeline = [];
    for (let i = 11; i >= 0; i--) {
      const start = startOfWeek(subWeeks(now, i));
      const end = endOfWeek(subWeeks(now, i));
      const count = await prisma.application.count({ where: { userId, sentAt: { gte: start, lte: end } } });
      timeline.push({ week: `S${12 - i}`, count, date: start.toISOString().split('T')[0] });
    }

    const upcomingInterviews = await prisma.application.findMany({
      where: { userId, interviewAt: { gte: now }, status: 'INTERVIEW' },
      orderBy: { interviewAt: 'asc' }, take: 5,
      select: { id: true, company: true, position: true, interviewAt: true },
    });

    const followUpsNeeded = await prisma.application.findMany({
      where: { userId, status: { in: ['SENT', 'FOLLOWUP'] }, followUpAt: { lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } },
      orderBy: { followUpAt: 'asc' }, take: 5,
      select: { id: true, company: true, position: true, followUpAt: true, sentAt: true },
    });

    res.json({
      overview: { total, sent, followup, interview, offer, accepted, rejected, ghosted, responseRate: parseFloat(responseRate), successRate: parseFloat(successRate) },
      progress: { thisWeek, thisMonth },
      sectors: sectorStats.map(s => ({ name: s.sector, count: s._count.sector })),
      cities: cityStats.map(c => ({ name: c.city, count: c._count.city })),
      timeline,
      upcoming: { interviews: upcomingInterviews, followUps: followUpsNeeded },
    });
  } catch (error) { next(error); }
});

export { router as dashboardRouter };
