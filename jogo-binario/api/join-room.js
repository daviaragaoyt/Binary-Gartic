import { rooms } from './create-room';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { roomId, username } = req.body;
    const room = rooms[roomId];
    if (!room) return res.status(404).json({ error: 'Room not found' });

    if (!room.players.find(p => p.username === username)) {
      room.players.push({ username, score: 0 });
    }

    res.status(200).json({ message: 'Joined' });
  }
}