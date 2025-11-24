import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

const router = express.Router();

router.get('/me', authenticate, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: { id: true, email: true, name: true, createdAt: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
