import { rooms } from './create-room';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { roomId, username, answer } = req.body;
    const room = rooms[roomId];
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const correct = parseInt(room.binary, 2);
    if (parseInt(answer) === correct) {
      const player = room.players.find(p => p.username === username);
      if (player) player.score += 1;
      room.binary = (Math.floor(Math.random() * 31) + 1).toString(2);
    }

    res.status(200).json({ message: 'Answer received' });
  }
}