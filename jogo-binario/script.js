let roomId = '';
let username = '';

async function createRoom() {
  const res = await fetch('/api/create-room', { method: 'POST' });
  const data = await res.json();
  roomId = data.roomId;
  document.getElementById('room-info').innerText = `Sala: ${roomId}`;
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
}

async function joinRoom() {
  roomId = document.getElementById('room-code').value;
  username = document.getElementById('username').value;

  if (!roomId || !username) {
    alert('Preencha o nome e o código da sala.');
    return;
  }

  const res = await fetch('/api/join-room', {
    method: 'POST',
    body: JSON.stringify({ roomId, username }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.ok) {
    document.getElementById('room-info').innerText = `Sala: ${roomId}`;
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    pollGame();
  } else {
    alert('Sala não encontrada.');
  }
}

async function startGame() {
  await fetch('/api/start-game', {
    method: 'POST',
    body: JSON.stringify({ roomId }),
    headers: { 'Content-Type': 'application/json' },
  });
}

async function sendAnswer() {
  const answer = document.getElementById('answer').value;
  await fetch('/api/send-answer', {
    method: 'POST',
    body: JSON.stringify({ roomId, username, answer }),
    headers: { 'Content-Type': 'application/json' },
  });
}

async function pollGame() {
  setInterval(async () => {
    const res = await fetch(`/api/get-state?roomId=${roomId}`);
    const data = await res.json();

    document.getElementById('game-status').innerText = `Status: ${data.status}`;
    document.getElementById('players').innerHTML = data.players
      .map(p => `${p.username}: ${p.score}`)
      .join('<br>');

    if (data.status === 'playing') {
      document.getElementById('binary-display').classList.remove('hidden');
      document.getElementById('binary-text').innerText = data.binary;
    }
  }, 2000);
}