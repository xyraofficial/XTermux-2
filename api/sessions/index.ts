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
    return res.status(405).end();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
