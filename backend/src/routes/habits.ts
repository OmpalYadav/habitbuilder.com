import express from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

const router = express.Router();

const habitSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    scheduleType: z.enum(['DAILY', 'WEEKLY', 'CUSTOM']),
    color: z.string().optional(),
    icon: z.string().optional(),
    isPublic: z.boolean().optional(),
});

router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const habits = await prisma.habit.findMany({
            where: { userId: req.user!.userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ habits });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const data = habitSchema.parse(req.body);
        const habit = await prisma.habit.create({
            data: {
                ...data,
                userId: req.user!.userId,
            },
        });
        res.status(201).json({ habit });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const habit = await prisma.habit.findUnique({
            where: { id: req.params.id },
        });
        if (!habit || habit.userId !== req.user!.userId) {
            return res.status(404).json({ error: 'Habit not found' });
        }
        res.json({ habit });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const data = habitSchema.partial().parse(req.body);
        const habit = await prisma.habit.findUnique({
            where: { id: req.params.id },
        });
        if (!habit || habit.userId !== req.user!.userId) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        const updatedHabit = await prisma.habit.update({
            where: { id: req.params.id },
            data,
        });
        res.json({ habit: updatedHabit });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const habit = await prisma.habit.findUnique({
            where: { id: req.params.id },
        });
        if (!habit || habit.userId !== req.user!.userId) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        await prisma.habit.delete({ where: { id: req.params.id } });
        res.json({ message: 'Habit deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
