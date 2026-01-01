import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const sessions = await storage.getSessions();
      return res.status(200).json(sessions);
    }
    if (req.method === 'POST') {
      const session = await storage.createSession(req.body);
      return res.status(200).json(session);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('API Error in /api/sessions:', err);
    // Explicitly return a JSON error even for server errors
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
}
