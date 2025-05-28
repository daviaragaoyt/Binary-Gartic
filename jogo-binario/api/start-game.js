import { rooms } from './create-room';

function randomBinary() {
  const num = Math.floor(Math.random() * 31) + 1;
  return num.toString(2);
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ message: 'Start game API works!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
