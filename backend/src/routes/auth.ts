import express from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { hashPassword, comparePassword, generateTokens, setAuthCookies, clearAuthCookies, verifyRefreshToken } from '../utils/auth';

const router = express.Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: { email, passwordHash, name },
        });

        const session = await prisma.session.create({
            data: {
                userId: user.id,
                refreshTokenHash: 'placeholder',
                userAgent: req.headers['user-agent'],
                ip: req.ip,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        const { accessToken, refreshToken } = generateTokens(user.id, session.id);
        const refreshTokenHash = await hashPassword(refreshToken);

        await prisma.session.update({
            where: { id: session.id },
            data: { refreshTokenHash },
        });

        setAuthCookies(res, accessToken, refreshToken);
        res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await comparePassword(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const session = await prisma.session.create({
            data: {
                userId: user.id,
                refreshTokenHash: 'placeholder',
                userAgent: req.headers['user-agent'],
                ip: req.ip,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        const { accessToken, refreshToken } = generateTokens(user.id, session.id);
        const refreshTokenHash = await hashPassword(refreshToken);

        await prisma.session.update({
            where: { id: session.id },
            data: { refreshTokenHash },
        });

        setAuthCookies(res, accessToken, refreshToken);
        res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/logout', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        try {
            const payload = verifyRefreshToken(refreshToken);
            if (payload.sessionId) {
                await prisma.session.delete({ where: { id: payload.sessionId } }).catch(() => { });
            }
        } catch (e) {
            // Ignore invalid token
        }
    }
    clearAuthCookies(res);
    res.json({ message: 'Logged out' });
});

router.post('/refresh', async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const payload = verifyRefreshToken(token);
        if (!payload.sessionId) return res.status(401).json({ error: 'Invalid token format' });

        const session = await prisma.session.findUnique({ where: { id: payload.sessionId } });
        if (!session) return res.status(401).json({ error: 'Session expired' });

        const isValid = await comparePassword(token, session.refreshTokenHash);
        if (!isValid) {
            await prisma.session.delete({ where: { id: session.id } });
            return res.status(401).json({ error: 'Invalid token' });
        }

        const { accessToken, refreshToken } = generateTokens(payload.userId, session.id);
        const refreshTokenHash = await hashPassword(refreshToken);

        await prisma.session.update({
            where: { id: session.id },
            data: { refreshTokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        });

        setAuthCookies(res, accessToken, refreshToken);
        res.json({ accessToken });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
