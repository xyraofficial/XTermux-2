import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  const { sessionId } = req.query;
  try {
    if (req.method === 'GET') {
      const messages = await storage.getMessages(parseInt(sessionId));
      return res.status(200).json(messages);
    }
    if (req.method === 'DELETE') {
      await storage.clearSession(parseInt(sessionId));
      return res.status(204).end();
    }
    return res.status(405).end();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
