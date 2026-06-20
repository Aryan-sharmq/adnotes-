import User from '../models/User.js';
import { verifyToken } from '../utils/token.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'You need to sign in to continue.' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'That session is no longer valid. Sign in again.' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Your session expired. Sign in again.' });
  }
}
