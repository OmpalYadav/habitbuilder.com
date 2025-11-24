import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/auth';

export interface AuthRequest extends Request {
    user?: { userId: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
