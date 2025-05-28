let rooms = {};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const roomId = Math.random().toString(36).substring(2, 6);
    rooms[roomId] = {
      players: [],
      status: 'waiting',
      binary: '',
    };
    res.status(200).json({ roomId });
  }
}

export { rooms };