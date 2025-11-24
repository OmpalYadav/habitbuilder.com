import express from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

const router = express.Router();

const entrySchema = z.object({
    habitId: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    status: z.enum(['DONE', 'SKIPPED', 'PARTIAL']),
    notes: z.string().optional(),
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const { habitId, date, status, notes } = entrySchema.parse(req.body);

        const habit = await prisma.habit.findUnique({ where: { id: habitId } });
        if (!habit || habit.userId !== req.user!.userId) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        const entry = await prisma.habitEntry.upsert({
            where: {
                habitId_date: {
                    habitId,
                    date: new Date(date),
                },
            },
            update: { status, notes },
            create: {
                habitId,
                userId: req.user!.userId,
                date: new Date(date),
                status,
                notes,
            },
        });

        res.json({ entry });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', authenticate, async (req: AuthRequest, res) => {
    const { habitId, startDate, endDate } = req.query;

    try {
        const where: any = { userId: req.user!.userId };
        if (habitId) where.habitId = String(habitId);
        if (startDate && endDate) {
            where.date = {
                gte: new Date(String(startDate)),
                lte: new Date(String(endDate)),
            };
        }

        const entries = await prisma.habitEntry.findMany({ where });
        res.json({ entries });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
