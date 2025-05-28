// Lista de palavras para o jogo
const palavras = [
  "Uniceplac é a melhor",
  "I love Uniceplac",
  "TI por amor",
  "Semana Acadêmica",
  "Analise e Desenvolvimento de Sistemas",
  "Engenharia de Software",
  "Imperial",
  "TheChosenGarcia",
  "Obrigado por participar"
];

let palavraAtual = "";
let player = null;
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
let palavrasUsadas = [];
let tentativas = 0;
let maxTentativas = 3;
let pontuacao = 0;
let streak = 0; // sequência de acertos
let tempoInicio = 0;

// Função para converter texto para binário com formatação melhorada
function textoParaBinario(texto) {
  return texto.split('').map(letra => {
    const binario = letra.charCodeAt(0).toString(2).padStart(8, '0');
    return binario;
  }).join(' ');
}

// Validação de email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Cadastro do player com validações melhoradas
function cadastrarPlayer() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nome || nome.length < 2) {
    alert("Nome deve ter pelo menos 2 caracteres!");
    return;
  }

  if (!email || !validarEmail(email)) {
    alert("Digite um email válido!");
    return;
  }

  // Verifica se o email já existe
  const emailExistente = ranking.find(p => p.email === email);
  if (emailExistente) {
    player = emailExistente;
    player.nome = nome; // Atualiza o nome se mudou
  } else {
    player = { nome, email, pontos: 0, jogos: 0, acertos: 0, tempoTotal: 0 };
  }

  document.getElementById("cadastro").style.display = "none";
  document.getElementById("jogo").style.display = "block";
  document.getElementById("playerNome").textContent = nome;

  resetarJogo();
  proximaPalavra();
  atualizarRanking();
  atualizarEstatisticas();
}

// Reset do jogo
function resetarJogo() {
  palavrasUsadas = [];
  tentativas = 0;
  pontuacao = 0;
  streak = 0;
  atualizarContadores();
}

// Gera uma nova palavra em binário (sem repetir até acabar todas)
function proximaPalavra() {
  if (palavrasUsadas.length === palavras.length) {
    palavrasUsadas = [];
    alert("Parabéns! Você completou todas as palavras! Reiniciando...");
  }

  let palavrasDisponiveis = palavras.filter(p => !palavrasUsadas.includes(p));
  palavraAtual = palavrasDisponiveis[Math.floor(Math.random() * palavrasDisponiveis.length)];
  palavrasUsadas.push(palavraAtual);

  const codigoBinario = textoParaBinario(palavraAtual);

  // Exibe no console o binário e a palavra
  console.log(`Palavra: "${palavraAtual}"`);
  console.log(`Binário: ${codigoBinario}`);

  // Não mostra mais para o player
  document.getElementById("binario").innerHTML = `
    <div style="color: gray; font-style: italic;">
  🔒 Código secreto gerado! Desafie-se a decifrar.
</div>
    <small style="color: #666;">Dica: ${palavraAtual.length} caracteres</small>
  `;

  document.getElementById("resposta").value = "";
  document.getElementById("feedback").textContent = "";
  tentativas = 0;
  tempoInicio = Date.now();
  atualizarContadores();
}


// Verifica a resposta do player com sistema de tentativas
function verificarResposta() {
  const resposta = document.getElementById("resposta").value.trim();
  tentativas++;

  // Comparação mais flexível (ignora case e espaços extras)
  const respostaNormalizada = resposta.toLowerCase().replace(/\s+/g, ' ');
  const palavraNormalizada = palavraAtual.toLowerCase().replace(/\s+/g, ' ');

  if (respostaNormalizada === palavraNormalizada) {
    const tempoResposta = (Date.now() - tempoInicio) / 1000;
    let pontosGanhos = calcularPontos(tentativas, tempoResposta);

    player.pontos += pontosGanhos;
    player.acertos++;
    streak++;
    pontuacao += pontosGanhos;

    document.getElementById("feedback").innerHTML = `
      <div style="color: green; font-weight: bold;">
        ✅ Correto! +${pontosGanhos} pontos<br>
        Tempo: ${tempoResposta.toFixed(1)}s | Tentativas: ${tentativas}<br>
        Sequência: ${streak} acertos seguidos!
      </div>
    `;

    atualizarRanking();
    atualizarEstatisticas();

    // Auto-próxima palavra após 2 segundos
    setTimeout(() => {
      proximaPalavra();
    }, 2000);

  } else {
    if (tentativas >= maxTentativas) {
      document.getElementById("feedback").innerHTML = `
        <div style="color: red;">
          ❌ Esgotaram as tentativas! A resposta era: <strong>"${palavraAtual}"</strong><br>
          <button onclick="proximaPalavra()" style="margin-top: 10px;">Próxima Palavra</button>
        </div>
      `;
      streak = 0; // Quebra a sequência
    } else {
      document.getElementById("feedback").innerHTML = `
        <div style="color: orange;">
          ⚠️ Incorreto! Tentativa ${tentativas}/${maxTentativas}<br>
          <small>Dica: Verifique maiúsculas, minúsculas e espaços</small>
        </div>
      `;
    }
  }

  player.jogos++;
  atualizarContadores();
}

// Calcula pontos baseado em performance
function calcularPontos(tentativas, tempo) {
  let pontos = 10; // Base

  // Bônus por acertar na primeira tentativa
  if (tentativas === 1) pontos += 5;
  else if (tentativas === 2) pontos += 2;

  // Bônus por velocidade (menos de 30 segundos)
  if (tempo < 30) pontos += 3;
  else if (tempo < 60) pontos += 1;

  // Bônus por sequência
  if (streak >= 5) pontos += 5;
  else if (streak >= 3) pontos += 2;

  return pontos;
}

// Atualiza contadores na tela
function atualizarContadores() {
  const contadores = document.getElementById("contadores");
  if (contadores) {
    contadores.innerHTML = `
      Pontos da sessão: ${pontuacao} | 
      Sequência: ${streak} | 
      Tentativas: ${tentativas}/${maxTentativas}
    `;
  }
}

// Atualiza estatísticas do jogador
function atualizarEstatisticas() {
  const stats = document.getElementById("estatisticas");
  if (stats && player) {
    const precisao = player.jogos > 0 ? ((player.acertos / player.jogos) * 100).toFixed(1) : 0;
    stats.innerHTML = `
      <h3>Suas Estatísticas</h3>
      Total de pontos: ${player.pontos}<br>
      Jogos: ${player.jogos} | Acertos: ${player.acertos}<br>
      Precisão: ${precisao}%
    `;
  }
}

// Atualiza o ranking com mais informações
function atualizarRanking() {
  const idx = ranking.findIndex(p => p.email === player.email);
  if (idx >= 0) {
    ranking[idx] = { ...player };
  } else if (player) {
    ranking.push({ ...player });
  }

  ranking.sort((a, b) => b.pontos - a.pontos);
  localStorage.setItem("ranking", JSON.stringify(ranking));

  const lista = document.getElementById("listaRanking");
  lista.innerHTML = "";

  ranking.slice(0, 10).forEach((p, index) => { // Top 10
    const li = document.createElement("li");
    const precisao = p.jogos > 0 ? ((p.acertos / p.jogos) * 100).toFixed(1) : 0;
    const medalha = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";

    li.innerHTML = `
      ${medalha} <strong>${p.nome}</strong> - ${p.pontos} pts 
      <small>(${p.acertos}/${p.jogos} - ${precisao}%)</small>
    `;

    if (player && p.email === player.email) {
      li.style.backgroundColor = "#e3f2fd";
      li.style.fontWeight = "bold";
    }

    lista.appendChild(li);
  });
}

// Função para dar dica
function darDica() {
  const dicas = [
    `A palavra tem ${palavraAtual.length} caracteres`,
    `Primeira letra: "${palavraAtual[0]}"`,
    `Última letra: "${palavraAtual[palavraAtual.length - 1]}"`,
    `Contém a letra: "${palavraAtual[Math.floor(palavraAtual.length / 2)]}"`
  ];

  const dicaAleatoria = dicas[Math.floor(Math.random() * dicas.length)];
  document.getElementById("feedback").innerHTML = `
    <div style="color: blue;">💡 Dica: ${dicaAleatoria}</div>
  `;
}

// Permite usar Enter para enviar resposta
document.addEventListener('DOMContentLoaded', function () {
  const inputResposta = document.getElementById("resposta");
  if (inputResposta) {
    inputResposta.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        verificarResposta();
      }
    });
  }
});

// Inicializa o ranking ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
  atualizarRanking();
});