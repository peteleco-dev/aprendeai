// medium.js — Exercício Médio: Lista de Tarefas
const MEDIUM_EXERCISE = {
  id: 'todo-list',
  title: 'Lista de Tarefas',
  level: 'Médio',
  description: 'Construa um todo list funcional onde o usuário pode adicionar tarefas, marcar como concluídas e excluí-las.',
  instructions: [
    'Digite uma tarefa no campo de texto e clique em "Adicionar".',
    'Cada tarefa deve aparecer como um item na lista.',
    'Clicar na tarefa deve marcar/desmarcar como concluída (texto riscado).',
    'Deve haver um botão para excluir cada tarefa.',
    'Não deve ser possível adicionar uma tarefa vazia.',
  ],

  scaffold: {
    html: `<div id="app">
  <h1>Minhas Tarefas</h1>
  <div id="area-input">
    <input type="text" id="nova-tarefa" placeholder="Digite uma tarefa...">
    <button id="btn-adicionar">Adicionar</button>
  </div>
  <ul id="lista-tarefas"></ul>
</div>`,
    css: `body {
  font-family: sans-serif;
  max-width: 500px;
  margin: 40px auto;
  padding: 0 20px;
}

#area-input {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

#nova-tarefa {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

#btn-adicionar {
  padding: 10px 16px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

#lista-tarefas {
  list-style: none;
  padding: 0;
}`,
    js: `// Seu código JavaScript aqui
// Dica: use element.addEventListener('click', ...) para os eventos
`,
  },

  example: {
    html: `<div id="app">
  <h1>Minhas Tarefas</h1>
  <div id="area-input">
    <input type="text" id="nova-tarefa" placeholder="Digite uma tarefa...">
    <button id="btn-adicionar">Adicionar</button>
  </div>
  <ul id="lista-tarefas"></ul>
</div>`,
    css: `* { box-sizing: border-box; }
body {
  font-family: 'Segoe UI', sans-serif;
  max-width: 480px;
  margin: 40px auto;
  padding: 0 20px;
  background: #f8fafc;
  color: #1e293b;
}
h1 { color: #7c3aed; margin-bottom: 1rem; }
#area-input {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}
#nova-tarefa {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
#nova-tarefa:focus { border-color: #7c3aed; }
#btn-adicionar {
  padding: 10px 18px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}
#btn-adicionar:hover { background: #6d28d9; }
#lista-tarefas { list-style: none; padding: 0; }
.item-tarefa {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  transition: opacity 0.2s;
}
.item-tarefa span {
  flex: 1;
  cursor: pointer;
  font-size: 0.95rem;
}
.item-tarefa.concluida span {
  text-decoration: line-through;
  color: #94a3b8;
}
.btn-excluir {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  line-height: 1;
}`,
    js: `const input = document.getElementById('nova-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const lista = document.getElementById('lista-tarefas');

function adicionarTarefa() {
  const texto = input.value.trim();
  if (!texto) return;

  const li = document.createElement('li');
  li.className = 'item-tarefa';

  const span = document.createElement('span');
  span.textContent = texto;
  span.addEventListener('click', () => {
    li.classList.toggle('concluida');
  });

  const btnExcluir = document.createElement('button');
  btnExcluir.className = 'btn-excluir';
  btnExcluir.textContent = '✕';
  btnExcluir.addEventListener('click', () => li.remove());

  li.appendChild(span);
  li.appendChild(btnExcluir);
  lista.appendChild(li);
  input.value = '';
  input.focus();
}

btnAdicionar.addEventListener('click', adicionarTarefa);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') adicionarTarefa();
});`,
  },

  solution: {
    html: `<div id="app">
  <h1>Minhas Tarefas</h1>
  <div id="area-input">
    <input type="text" id="nova-tarefa" placeholder="Digite uma tarefa...">
    <button id="btn-adicionar">Adicionar</button>
  </div>
  <ul id="lista-tarefas"></ul>
</div>`,
    css: `body {
  font-family: sans-serif;
  max-width: 480px;
  margin: 40px auto;
  padding: 0 20px;
}
#area-input { display: flex; gap: 8px; margin-bottom: 16px; }
#nova-tarefa {
  flex: 1; padding: 10px;
  border: 2px solid #e2e8f0; border-radius: 6px; font-size: 1rem;
}
#btn-adicionar {
  padding: 10px 16px; background: #7c3aed; color: white;
  border: none; border-radius: 6px; cursor: pointer;
}
#lista-tarefas { list-style: none; padding: 0; }
.item-tarefa {
  display: flex; align-items: center; gap: 10px;
  padding: 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 8px;
}
.item-tarefa span { flex: 1; cursor: pointer; }
.item-tarefa.concluida span { text-decoration: line-through; color: #94a3b8; }
.btn-excluir { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; }`,
    js: `const input = document.getElementById('nova-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const lista = document.getElementById('lista-tarefas');

function adicionarTarefa() {
  const texto = input.value.trim();
  if (!texto) return;

  const li = document.createElement('li');
  li.className = 'item-tarefa';

  const span = document.createElement('span');
  span.textContent = texto;
  span.addEventListener('click', () => li.classList.toggle('concluida'));

  const btnExcluir = document.createElement('button');
  btnExcluir.className = 'btn-excluir';
  btnExcluir.textContent = '✕';
  btnExcluir.addEventListener('click', () => li.remove());

  li.appendChild(span);
  li.appendChild(btnExcluir);
  lista.appendChild(li);
  input.value = '';
}

btnAdicionar.addEventListener('click', adicionarTarefa);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') adicionarTarefa();
});`,
  },

  rules: [
    {
      id: 'input-exists',
      label: 'Input #nova-tarefa existe',
      test: async (doc) => doc.querySelector('#nova-tarefa') !== null,
    },
    {
      id: 'btn-add-exists',
      label: 'Botão #btn-adicionar existe',
      test: async (doc) => doc.querySelector('#btn-adicionar') !== null,
    },
    {
      id: 'list-exists',
      label: 'Lista #lista-tarefas existe',
      test: async (doc) => doc.querySelector('#lista-tarefas') !== null,
    },
    {
      id: 'can-add-item',
      label: 'Adicionar item cria um &lt;li&gt; na lista',
      test: async (doc) => {
        const input = doc.querySelector('#nova-tarefa');
        const btn = doc.querySelector('#btn-adicionar');
        const lista = doc.querySelector('#lista-tarefas');
        if (!input || !btn || !lista) return false;
        input.value = 'Tarefa de teste';
        btn.click();
        await new Promise(r => setTimeout(r, 100));
        return lista.querySelectorAll('li').length > 0;
      },
    },
    {
      id: 'item-has-text',
      label: 'O item adicionado contém o texto digitado',
      test: async (doc) => {
        const input = doc.querySelector('#nova-tarefa');
        const btn = doc.querySelector('#btn-adicionar');
        const lista = doc.querySelector('#lista-tarefas');
        if (!input || !btn || !lista) return false;
        const texto = 'ValidacaoTexto_' + Date.now();
        input.value = texto;
        btn.click();
        await new Promise(r => setTimeout(r, 100));
        return lista.textContent.includes(texto);
      },
    },
    {
      id: 'can-complete-item',
      label: 'Clicar na tarefa alterna estado de concluída',
      test: async (doc) => {
        const input = doc.querySelector('#nova-tarefa');
        const btn = doc.querySelector('#btn-adicionar');
        const lista = doc.querySelector('#lista-tarefas');
        if (!input || !btn || !lista) return false;
        input.value = 'Tarefa para concluir';
        btn.click();
        await new Promise(r => setTimeout(r, 100));
        const li = lista.querySelector('li');
        if (!li) return false;
        const antes = { class: li.className, style: li.querySelector('span') ? li.querySelector('span').style.cssText : '' };
        const clickable = li.querySelector('span') || li;
        clickable.click();
        await new Promise(r => setTimeout(r, 100));
        const depois = { class: li.className, style: li.querySelector('span') ? li.querySelector('span').style.cssText : '' };
        return antes.class !== depois.class || antes.style !== depois.style;
      },
    },
    {
      id: 'can-delete-item',
      label: 'Existe mecanismo para excluir itens',
      test: async (doc) => {
        const input = doc.querySelector('#nova-tarefa');
        const btn = doc.querySelector('#btn-adicionar');
        const lista = doc.querySelector('#lista-tarefas');
        if (!input || !btn || !lista) return false;
        input.value = 'Tarefa para excluir';
        btn.click();
        await new Promise(r => setTimeout(r, 100));
        const countAntes = lista.querySelectorAll('li').length;
        const li = lista.querySelector('li');
        if (!li) return false;
        const deleteBtn = li.querySelector('button');
        if (!deleteBtn) return false;
        deleteBtn.click();
        await new Promise(r => setTimeout(r, 100));
        return lista.querySelectorAll('li').length < countAntes;
      },
    },
    {
      id: 'empty-input-guard',
      label: 'Input vazio não adiciona tarefa em branco',
      test: async (doc) => {
        const input = doc.querySelector('#nova-tarefa');
        const btn = doc.querySelector('#btn-adicionar');
        const lista = doc.querySelector('#lista-tarefas');
        if (!input || !btn || !lista) return false;
        const countAntes = lista.querySelectorAll('li').length;
        input.value = '   ';
        btn.click();
        await new Promise(r => setTimeout(r, 100));
        return lista.querySelectorAll('li').length === countAntes;
      },
    },
  ],
};
