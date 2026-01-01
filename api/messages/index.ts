import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      const message = await storage.addMessage(req.body);
      return res.status(200).json(message);
    }
    return res.status(405).end();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
