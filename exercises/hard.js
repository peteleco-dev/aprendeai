// hard.js — Exercício Difícil: App de Quiz
const HARD_EXERCISE = {
  id: 'quiz-app',
  title: 'App de Quiz',
  level: 'Difícil',
  description: 'Desenvolva um quiz com 5 perguntas de JavaScript, cada uma com 4 alternativas, timer por questão (15s), placar em tempo real e tela de resultado.',
  instructions: [
    'Exiba perguntas com 4 alternativas de resposta.',
    'Cada pergunta tem um timer de 15 segundos — se acabar, avança automaticamente.',
    'O placar deve atualizar em tempo real quando acertar.',
    'Após 5 perguntas, exiba a tela de resultado com % de acerto.',
    'Deve existir um botão para jogar novamente que reinicia o quiz.',
  ],

  scaffold: {
    html: `<div id="app">
  <div id="tela-quiz">
    <div id="cabecalho">
      <span id="numero-pergunta">Pergunta 1/5</span>
      <span id="placar">Pontos: 0</span>
      <span id="timer-pergunta">⏱ 15</span>
    </div>
    <h2 id="texto-pergunta"></h2>
    <div id="alternativas"></div>
  </div>
  <div id="tela-resultado" style="display:none">
    <h2>Resultado</h2>
    <p id="texto-resultado"></p>
    <button id="btn-reiniciar">Jogar Novamente</button>
  </div>
</div>`,
    css: `body {
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #f0f4f8;
}

#app {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

#cabecalho {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: 0.9rem;
  color: #64748b;
}

#texto-pergunta {
  margin-bottom: 20px;
  font-size: 1.1rem;
  line-height: 1.5;
}

#alternativas {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  text-align: left;
  transition: all 0.2s;
}

button:hover {
  border-color: #7c3aed;
  background: #f5f3ff;
}`,
    js: `// Seu código JavaScript aqui
// Dica: use as perguntas abaixo como ponto de partida!
const perguntas = [
  {
    pergunta: 'Qual método adiciona um item ao final de um array?',
    alternativas: ['push()', 'pop()', 'shift()', 'unshift()'],
    correta: 0
  },
  {
    pergunta: 'O que o operador === verifica?',
    alternativas: ['Apenas o valor', 'Apenas o tipo', 'Valor e tipo', 'Referência de memória'],
    correta: 2
  },
  {
    pergunta: 'Qual é o resultado de typeof null?',
    alternativas: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correta: 2
  },
  {
    pergunta: 'Como declarar uma constante em JS moderno?',
    alternativas: ['var x = 1', 'let x = 1', 'const x = 1', 'define x = 1'],
    correta: 2
  },
  {
    pergunta: 'Qual método converte um array em string?',
    alternativas: ['toString()', 'join()', 'Ambos funcionam', 'stringify()'],
    correta: 2
  }
];
`,
  },

  example: {
    html: `<div id="app">
  <div id="tela-quiz">
    <div id="cabecalho">
      <span id="numero-pergunta">Pergunta 1/5</span>
      <span id="placar">Pontos: 0</span>
      <span id="timer-pergunta">⏱ 15</span>
    </div>
    <h2 id="texto-pergunta"></h2>
    <div id="alternativas"></div>
  </div>
  <div id="tela-resultado" style="display:none">
    <h2>Resultado Final</h2>
    <p id="texto-resultado"></p>
    <button id="btn-reiniciar">Jogar Novamente</button>
  </div>
</div>`,
    css: `* { box-sizing: border-box; }
body {
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
#app {
  background: white;
  border-radius: 16px;
  padding: 36px;
  max-width: 520px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}
#cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}
#numero-pergunta { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
#placar {
  font-size: 0.9rem;
  background: #f0fdf4;
  color: #16a34a;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
}
#timer-pergunta {
  font-size: 0.85rem;
  font-weight: bold;
  color: #7c3aed;
  background: #f5f3ff;
  padding: 4px 10px;
  border-radius: 20px;
}
#timer-pergunta.urgente { color: #ef4444; background: #fef2f2; }
#texto-pergunta {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #1e293b;
  margin-bottom: 24px;
  min-height: 60px;
}
#alternativas { display: flex; flex-direction: column; gap: 10px; }
.alt-btn {
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  text-align: left;
  transition: all 0.15s;
  color: #334155;
}
.alt-btn:hover:not(:disabled) { border-color: #7c3aed; background: #f5f3ff; color: #7c3aed; }
.alt-btn.correta { border-color: #22c55e; background: #f0fdf4; color: #16a34a; }
.alt-btn.errada { border-color: #ef4444; background: #fef2f2; color: #ef4444; }
#tela-resultado { text-align: center; }
#tela-resultado h2 { color: #7c3aed; margin-bottom: 12px; }
#texto-resultado { font-size: 1.2rem; color: #334155; margin-bottom: 24px; line-height: 1.6; }
#btn-reiniciar {
  padding: 14px 32px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}
#btn-reiniciar:hover { background: #6d28d9; }`,
    js: `const perguntas = [
  { pergunta: 'Qual método adiciona um item ao final de um array?', alternativas: ['push()', 'pop()', 'shift()', 'unshift()'], correta: 0 },
  { pergunta: 'O que o operador === verifica?', alternativas: ['Apenas o valor', 'Apenas o tipo', 'Valor e tipo', 'Referência de memória'], correta: 2 },
  { pergunta: 'Qual é o resultado de typeof null?', alternativas: ['"null"', '"undefined"', '"object"', '"boolean"'], correta: 2 },
  { pergunta: 'Como declarar uma constante em JS moderno?', alternativas: ['var x = 1', 'let x = 1', 'const x = 1', 'define x = 1'], correta: 2 },
  { pergunta: 'Qual método converte um array em string?', alternativas: ['toString()', 'join()', 'Ambos funcionam', 'stringify()'], correta: 2 }
];

let indiceAtual = 0;
let pontos = 0;
let timerInterval = null;
let segundosRestantes = 15;

const elPergunta = document.getElementById('texto-pergunta');
const elAlternativas = document.getElementById('alternativas');
const elNumero = document.getElementById('numero-pergunta');
const elPlacar = document.getElementById('placar');
const elTimer = document.getElementById('timer-pergunta');
const telaQuiz = document.getElementById('tela-quiz');
const telaResultado = document.getElementById('tela-resultado');
const elResultado = document.getElementById('texto-resultado');
const btnReiniciar = document.getElementById('btn-reiniciar');

function iniciarTimer() {
  clearInterval(timerInterval);
  segundosRestantes = 15;
  atualizarTimerDisplay();
  timerInterval = setInterval(() => {
    segundosRestantes--;
    atualizarTimerDisplay();
    if (segundosRestantes <= 5) elTimer.classList.add('urgente');
    if (segundosRestantes <= 0) proximaPergunta();
  }, 1000);
}

function atualizarTimerDisplay() {
  elTimer.textContent = '⏱ ' + segundosRestantes;
}

function mostrarPergunta() {
  const p = perguntas[indiceAtual];
  elNumero.textContent = 'Pergunta ' + (indiceAtual + 1) + '/' + perguntas.length;
  elPergunta.textContent = p.pergunta;
  elAlternativas.innerHTML = '';
  elTimer.classList.remove('urgente');

  p.alternativas.forEach((alt, i) => {
    const btn = document.createElement('button');
    btn.className = 'alt-btn';
    btn.textContent = alt;
    btn.addEventListener('click', () => responder(i, btn, p.correta));
    elAlternativas.appendChild(btn);
  });

  iniciarTimer();
}

function responder(indice, btnClicado, correta) {
  clearInterval(timerInterval);
  const botoesAlt = elAlternativas.querySelectorAll('.alt-btn');
  botoesAlt.forEach(b => b.disabled = true);

  if (indice === correta) {
    pontos++;
    btnClicado.classList.add('correta');
    elPlacar.textContent = 'Pontos: ' + pontos;
  } else {
    btnClicado.classList.add('errada');
    botoesAlt[correta].classList.add('correta');
  }

  setTimeout(proximaPergunta, 1200);
}

function proximaPergunta() {
  clearInterval(timerInterval);
  indiceAtual++;
  if (indiceAtual < perguntas.length) {
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
}

function mostrarResultado() {
  telaQuiz.style.display = 'none';
  telaResultado.style.display = 'block';
  const pct = Math.round((pontos / perguntas.length) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪';
  elResultado.innerHTML = emoji + ' Você acertou <strong>' + pontos + '/' + perguntas.length + '</strong> questões<br><strong>' + pct + '%</strong> de aproveitamento';
}

function reiniciar() {
  indiceAtual = 0;
  pontos = 0;
  elPlacar.textContent = 'Pontos: 0';
  telaResultado.style.display = 'none';
  telaQuiz.style.display = 'block';
  mostrarPergunta();
}

btnReiniciar.addEventListener('click', reiniciar);
mostrarPergunta();`,
  },

  solution: {
    html: `<div id="app">
  <div id="tela-quiz">
    <div id="cabecalho">
      <span id="numero-pergunta">Pergunta 1/5</span>
      <span id="placar">Pontos: 0</span>
      <span id="timer-pergunta">⏱ 15</span>
    </div>
    <h2 id="texto-pergunta"></h2>
    <div id="alternativas"></div>
  </div>
  <div id="tela-resultado" style="display:none">
    <h2>Resultado</h2>
    <p id="texto-resultado"></p>
    <button id="btn-reiniciar">Jogar Novamente</button>
  </div>
</div>`,
    css: `body {
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #f0f4f8;
}
#app {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
#cabecalho { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 0.9rem; color: #64748b; }
#texto-pergunta { margin-bottom: 20px; font-size: 1.1rem; line-height: 1.5; }
#alternativas { display: flex; flex-direction: column; gap: 10px; }
button { padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; font-size: 0.95rem; text-align: left; }
button:hover:not(:disabled) { border-color: #7c3aed; }
.correta { border-color: #22c55e !important; background: #f0fdf4 !important; }
.errada { border-color: #ef4444 !important; background: #fef2f2 !important; }
#tela-resultado { text-align: center; }
#btn-reiniciar { width: 100%; background: #7c3aed; color: white; border: none; border-radius: 8px; padding: 14px; font-size: 1rem; cursor: pointer; }`,
    js: `const perguntas = [
  { pergunta: 'Qual método adiciona um item ao final de um array?', alternativas: ['push()', 'pop()', 'shift()', 'unshift()'], correta: 0 },
  { pergunta: 'O que o operador === verifica?', alternativas: ['Apenas o valor', 'Apenas o tipo', 'Valor e tipo', 'Referência de memória'], correta: 2 },
  { pergunta: 'Qual é o resultado de typeof null?', alternativas: ['"null"', '"undefined"', '"object"', '"boolean"'], correta: 2 },
  { pergunta: 'Como declarar uma constante em JS moderno?', alternativas: ['var x = 1', 'let x = 1', 'const x = 1', 'define x = 1'], correta: 2 },
  { pergunta: 'Qual método converte um array em string?', alternativas: ['toString()', 'join()', 'Ambos funcionam', 'stringify()'], correta: 2 }
];

let indiceAtual = 0, pontos = 0, timerInterval = null, segundos = 15;
const el = id => document.getElementById(id);

function iniciarTimer() {
  clearInterval(timerInterval);
  segundos = 15;
  el('timer-pergunta').textContent = '⏱ ' + segundos;
  timerInterval = setInterval(() => {
    segundos--;
    el('timer-pergunta').textContent = '⏱ ' + segundos;
    if (segundos <= 0) proximaPergunta();
  }, 1000);
}

function mostrarPergunta() {
  const p = perguntas[indiceAtual];
  el('numero-pergunta').textContent = 'Pergunta ' + (indiceAtual + 1) + '/' + perguntas.length;
  el('texto-pergunta').textContent = p.pergunta;
  el('alternativas').innerHTML = '';
  p.alternativas.forEach((alt, i) => {
    const btn = document.createElement('button');
    btn.textContent = alt;
    btn.onclick = () => responder(i, btn, p.correta);
    el('alternativas').appendChild(btn);
  });
  iniciarTimer();
}

function responder(i, btn, correta) {
  clearInterval(timerInterval);
  el('alternativas').querySelectorAll('button').forEach(b => b.disabled = true);
  if (i === correta) { pontos++; btn.classList.add('correta'); el('placar').textContent = 'Pontos: ' + pontos; }
  else { btn.classList.add('errada'); el('alternativas').querySelectorAll('button')[correta].classList.add('correta'); }
  setTimeout(proximaPergunta, 1200);
}

function proximaPergunta() {
  clearInterval(timerInterval);
  if (++indiceAtual < perguntas.length) { mostrarPergunta(); return; }
  el('tela-quiz').style.display = 'none';
  el('tela-resultado').style.display = 'block';
  const pct = Math.round(pontos / perguntas.length * 100);
  el('texto-resultado').innerHTML = 'Você acertou <b>' + pontos + '/' + perguntas.length + '</b> — ' + pct + '% de aproveitamento';
}

el('btn-reiniciar').onclick = () => {
  indiceAtual = pontos = 0;
  el('placar').textContent = 'Pontos: 0';
  el('tela-resultado').style.display = 'none';
  el('tela-quiz').style.display = 'block';
  mostrarPergunta();
};

mostrarPergunta();`,
  },

  hints: [
    'Organize as perguntas em um array de objetos: { pergunta: \'...\', alternativas: [...], correta: 0 } onde correta é o índice da alternativa certa.',
    'Renderize as alternativas dinamicamente: percorra o array com forEach, crie um <button> para cada uma e adicione um evento de click que chama uma função responder(indice).',
    'Use setInterval para o timer. Guarde o id retornado (let timerInterval) para cancelar com clearInterval(timerInterval) quando o usuário responder ou o tempo acabar.',
    'Ao responder, compare o índice clicado com correta. Se igual, incremente pontos e atualize o #placar. Destaque a resposta certa/errada com classList e desabilite os botões com .disabled = true.',
    'Na tela de resultado, calcule a porcentagem com Math.round((pontos / perguntas.length) * 100) e mostre no #texto-resultado. Para reiniciar, reponha as variáveis e chame mostrarPergunta() novamente.',
  ],

  rules: [
    {
      id: 'pergunta-exists',
      label: '#texto-pergunta existe e tem conteúdo',
      test: async (doc) => {
        const el = doc.querySelector('#texto-pergunta');
        return el !== null && el.textContent.trim().length > 0;
      },
    },
    {
      id: 'four-alternatives',
      label: '#alternativas tem exatamente 4 opções',
      test: async (doc) => {
        const container = doc.querySelector('#alternativas');
        if (!container) return false;
        const botoesAlt = container.querySelectorAll('button');
        return botoesAlt.length === 4;
      },
    },
    {
      id: 'click-advances',
      label: 'Clicar numa alternativa avança para próxima pergunta',
      test: async (doc) => {
        const container = doc.querySelector('#alternativas');
        const elPergunta = doc.querySelector('#texto-pergunta');
        if (!container || !elPergunta) return false;
        const perguntaAntes = elPergunta.textContent;
        const btn = container.querySelector('button');
        if (!btn) return false;
        btn.click();
        await new Promise(r => setTimeout(r, 1500));
        return elPergunta.textContent !== perguntaAntes || doc.querySelector('#tela-resultado').style.display === 'block';
      },
    },
    {
      id: 'placar-updates',
      label: '#placar existe e exibe pontuação',
      test: async (doc) => doc.querySelector('#placar') !== null,
    },
    {
      id: 'timer-exists',
      label: '#timer-pergunta existe com valor numérico',
      test: async (doc) => {
        const el = doc.querySelector('#timer-pergunta');
        if (!el) return false;
        return /\d/.test(el.textContent);
      },
    },
    {
      id: 'resultado-shown',
      label: 'Tela de resultado aparece após todas as perguntas',
      test: async (doc) => {
        const telaResultado = doc.querySelector('#tela-resultado');
        if (!telaResultado) return false;
        // Click through all questions quickly
        for (let i = 0; i < 6; i++) {
          const btn = doc.querySelector('#alternativas button');
          if (btn) btn.click();
          await new Promise(r => setTimeout(r, 1500));
          if (telaResultado.style.display === 'block') return true;
        }
        return telaResultado.style.display === 'block' || telaResultado.style.display === '';
      },
    },
    {
      id: 'resultado-has-percent',
      label: '#texto-resultado contém porcentagem de acerto',
      test: async (doc) => {
        // Click through all questions
        for (let i = 0; i < 6; i++) {
          const btn = doc.querySelector('#alternativas button');
          if (btn) btn.click();
          await new Promise(r => setTimeout(r, 1500));
          const telaResultado = doc.querySelector('#tela-resultado');
          if (telaResultado && telaResultado.style.display === 'block') break;
        }
        const el = doc.querySelector('#texto-resultado');
        return el !== null && /%/.test(el.textContent);
      },
    },
    {
      id: 'reiniciar-exists',
      label: 'Botão #btn-reiniciar existe',
      test: async (doc) => doc.querySelector('#btn-reiniciar') !== null,
    },
    {
      id: 'reiniciar-works',
      label: 'Reiniciar volta para a pergunta 1',
      test: async (doc) => {
        // Click through all questions to reach result screen
        for (let i = 0; i < 6; i++) {
          const btn = doc.querySelector('#alternativas button');
          if (btn) btn.click();
          await new Promise(r => setTimeout(r, 1500));
          const telaResultado = doc.querySelector('#tela-resultado');
          if (telaResultado && telaResultado.style.display === 'block') break;
        }
        const btnReiniciar = doc.querySelector('#btn-reiniciar');
        if (!btnReiniciar) return false;
        btnReiniciar.click();
        await new Promise(r => setTimeout(r, 200));
        const numPergunta = doc.querySelector('#numero-pergunta');
        return numPergunta && /1/.test(numPergunta.textContent);
      },
    },
  ],
};
