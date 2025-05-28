import { rooms } from './create-room';

export default function handler(req, res) {
  const { roomId } = req.query;
  const room = rooms[roomId];
  if (!room) return res.status(404).json({ error: 'Room not found' });

  res.status(200).json({
    status: room.status,
    players: room.players,
    binary: room.status === 'playing' ? room.binary : '',
  });
}