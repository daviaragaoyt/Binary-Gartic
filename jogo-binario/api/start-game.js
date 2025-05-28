import { rooms } from './create-room';

function randomBinary() {
  const num = Math.floor(Math.random() * 31) + 1;
  return num.toString(2);
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { roomId } = req.body;
    const room = rooms[roomId];
    if (!room) return res.status(404).json({ error: 'Room not found' });

    room.status = 'playing';
    room.binary = randomBinary();

    res.status(200).json({ message: 'Game started' });
  }
}