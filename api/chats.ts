import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db';
import { chatSessions } from '../schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send();
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    if (req.method === 'GET') {
      const sessions = await db.select().from(chatSessions).where(eq(chatSessions.userId, decoded.userId));
      return res.json(sessions);
    }
    
    if (req.method === 'POST') {
      const { id, title, messages } = req.body;
      await db.insert(chatSessions).values({
        id,
        userId: decoded.userId,
        title,
        messages
      }).onConflictDoUpdate({
        target: chatSessions.id,
        set: { title, messages, updatedAt: new Date() }
      });
      return res.json({ success: true });
    }
    
    res.status(405).send('Method Not Allowed');
  } catch (err) {
    res.status(401).send();
  }
}