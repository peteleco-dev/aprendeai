// easy.js — Exercício Fácil: Botão Contador de Cores
const EASY_EXERCISE = {
  id: 'color-counter',
  title: 'Botão Contador de Cores',
  level: 'Fácil',
  description: 'Crie uma página com um botão que muda a cor de fundo aleatoriamente a cada clique e exibe quantas vezes foi clicado.',
  instructions: [
    'Ao clicar no botão, a cor de fundo da página deve mudar para uma cor aleatória.',
    'O contador deve exibir quantas vezes o botão foi clicado.',
    'O contador deve começar em 0.',
    'Cada clique deve gerar uma cor diferente da anterior.',
  ],

  scaffold: {
    html: `<div id="app">
  <h1>Contador de Cliques</h1>
  <p id="contador">Cliques: 0</p>
  <button id="btn-cor">Mudar Cor</button>
</div>`,
    css: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: sans-serif;
  transition: background-color 0.3s;
}

#app {
  text-align: center;
}

button {
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: #7c3aed;
  color: white;
}`,
    js: `// Seu código JavaScript aqui
// Dica: use document.getElementById() para acessar os elementos
`,
  },

  example: {
    html: `<div id="app">
  <h1>Contador de Cliques</h1>
  <p id="contador">Cliques: 0</p>
  <button id="btn-cor">Mudar Cor</button>
</div>`,
    css: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: sans-serif;
  transition: background-color 0.4s ease;
  background: #f0f4f8;
}
#app { text-align: center; }
h1 { color: #1e293b; margin-bottom: 0.5rem; }
#contador { font-size: 1.2rem; color: #475569; margin-bottom: 1rem; }
button {
  padding: 12px 28px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: #7c3aed;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(124,58,237,0.4);
  transition: transform 0.1s;
}
button:active { transform: scale(0.97); }`,
    js: `const btn = document.getElementById('btn-cor');
const contador = document.getElementById('contador');
let cliques = 0;
let ultimaCor = '';

function corAleatoria() {
  const letras = '0123456789ABCDEF';
  let cor = '#';
  do {
    cor = '#';
    for (let i = 0; i < 6; i++) {
      cor += letras[Math.floor(Math.random() * 16)];
    }
  } while (cor === ultimaCor);
  return cor;
}

btn.addEventListener('click', () => {
  cliques++;
  contador.textContent = 'Cliques: ' + cliques;
  const novaCor = corAleatoria();
  ultimaCor = novaCor;
  document.body.style.backgroundColor = novaCor;
});`,
  },

  solution: {
    html: `<div id="app">
  <h1>Contador de Cliques</h1>
  <p id="contador">Cliques: 0</p>
  <button id="btn-cor">Mudar Cor</button>
</div>`,
    css: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: sans-serif;
  transition: background-color 0.4s ease;
}
#app { text-align: center; }
h1 { font-size: 2rem; margin-bottom: 0.5rem; }
#contador { font-size: 1.2rem; margin-bottom: 1.5rem; }
button {
  padding: 12px 28px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: #7c3aed;
  color: white;
  font-weight: bold;
}`,
    js: `const btn = document.getElementById('btn-cor');
const contador = document.getElementById('contador');
let cliques = 0;
let ultimaCor = '';

function corAleatoria() {
  let cor;
  do {
    cor = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  } while (cor === ultimaCor);
  return cor;
}

btn.addEventListener('click', () => {
  cliques++;
  contador.textContent = 'Cliques: ' + cliques;
  ultimaCor = corAleatoria();
  document.body.style.backgroundColor = ultimaCor;
});`,
  },

  hints: [
    'Use document.getElementById(\'btn-cor\') para acessar o botão e adicione .addEventListener(\'click\', função) para reagir ao clique.',
    'Crie uma variável let cliques = 0 fora do evento. Dentro do evento, incremente com cliques++ e atualize o texto com element.textContent.',
    'Para atualizar o parágrafo: document.getElementById(\'contador\').textContent = \'Cliques: \' + cliques',
    'Para gerar uma cor hex aleatória: \'#\' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, \'0\')',
    'Aplique a cor com document.body.style.backgroundColor = cor. Guarde a última cor em uma variável e compare antes de aplicar para garantir que mude.',
  ],

  rules: [
    {
      id: 'btn-exists',
      label: 'Botão #btn-cor existe no DOM',
      test: async (doc) => doc.querySelector('#btn-cor') !== null,
    },
    {
      id: 'counter-exists',
      label: 'Elemento #contador existe no DOM',
      test: async (doc) => doc.querySelector('#contador') !== null,
    },
    {
      id: 'counter-starts-zero',
      label: 'Contador começa com 0',
      test: async (doc) => {
        const el = doc.querySelector('#contador');
        if (!el) return false;
        return /0/.test(el.textContent);
      },
    },
    {
      id: 'click-changes-bg',
      label: 'Clique no botão muda a cor de fundo',
      test: async (doc) => {
        const btn = doc.querySelector('#btn-cor');
        if (!btn) return false;
        const win = doc.defaultView;
        // Accept inline style OR CSS class/computed style changes
        const getBg = () => doc.body.style.backgroundColor || win.getComputedStyle(doc.body).backgroundColor;
        const antes = getBg();
        btn.click();
        await new Promise(r => setTimeout(r, 100));
        const depois = getBg();
        return depois !== antes;
      },
    },
    {
      id: 'counter-increments',
      label: 'Contador aumenta após cada clique',
      test: async (doc) => {
        const btn = doc.querySelector('#btn-cor');
        const el = doc.querySelector('#contador');
        if (!btn || !el) return false;
        const antes = el.textContent;
        btn.click();
        await new Promise(r => setTimeout(r, 100));
        return el.textContent !== antes;
      },
    },
    {
      id: 'color-is-random',
      label: 'Dois cliques consecutivos geram cores diferentes',
      test: async (doc) => {
        const btn = doc.querySelector('#btn-cor');
        if (!btn) return false;
        const win = doc.defaultView;
        const getBg = () => doc.body.style.backgroundColor || win.getComputedStyle(doc.body).backgroundColor;
        btn.click();
        await new Promise(r => setTimeout(r, 100));
        const cor1 = getBg();
        btn.click();
        await new Promise(r => setTimeout(r, 100));
        const cor2 = getBg();
        return cor1 !== '' && cor2 !== '' && cor1 !== cor2;
      },
    },
  ],
};
