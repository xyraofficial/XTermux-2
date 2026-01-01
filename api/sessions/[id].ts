import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  const { id } = req.query;
  try {
    if (req.method === 'PATCH') {
      await storage.updateSessionTitle(parseInt(id), req.body.title);
      return res.status(204).end();
    }
    if (req.method === 'DELETE') {
      await storage.deleteSession(parseInt(id));
      return res.status(204).end();
    }
    return res.status(405).end();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
