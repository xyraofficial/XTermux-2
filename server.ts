import express from 'express';
import cors from 'cors';
import { db } from './api/db.ts';
import { users } from './api/schema.ts';
import { eq } from 'drizzle-orm';
import loginHandler from './api/login.ts';
import registerHandler from './api/register.ts';
import chatHandler from './api/chats.ts';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.put('/api/profile', authenticate, async (req, res) => {
  const { username, avatar } = req.body;
  const userId = (req as any).userId;
  try {
    const [user] = await db.update(users)
      .set({ username, avatar })
      .where(eq(users.id, userId))
      .returning();
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update profile' });
  }
});

// Mocking the Vercel request/response for the local handlers
const wrapHandler = (handler: any) => (req: express.Request, res: express.Response) => {
  handler(req, res);
};

app.post('/api/login', wrapHandler(loginHandler));
app.post('/api/register', wrapHandler(registerHandler));
app.get('/api/chats', wrapHandler(chatHandler));
app.post('/api/chats', wrapHandler(chatHandler));

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
