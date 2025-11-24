import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
};

export const generateTokens = (userId: string, sessionId?: string) => {
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshPayload = sessionId ? { userId, sessionId } : { userId };
    const refreshToken = jwt.sign(refreshPayload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string; sessionId?: string };
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const clearAuthCookies = (res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};
