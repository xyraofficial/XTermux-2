import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }
  
  try {
    if (req.method === 'GET') {
      const messages = await storage.getMessages(parseInt(sessionId as string));
      return res.status(200).json(messages);
    }
    if (req.method === 'DELETE') {
      await storage.clearSession(parseInt(sessionId as string));
      return res.status(204).end();
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(`API Error in /api/messages/${sessionId}:`, err);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message 
    });
  }
}
