import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '30d',
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Random URL-safe token + its expiry (hours from now).
export function makeToken(hours = 24) {
  const token = crypto.randomBytes(32).toString('hex');
  const exp = new Date(Date.now() + hours * 60 * 60 * 1000);
  return { token, exp };
}
