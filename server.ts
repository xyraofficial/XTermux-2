import express from 'express';
import cors from 'cors';
import { db } from './api/db.ts';
import loginHandler from './api/login.ts';
import registerHandler from './api/register.ts';
import chatHandler from './api/chats.ts';

const app = express();
app.use(cors());
app.use(express.json());

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
