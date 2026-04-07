// app.js — bootstrap e renderização das views
const App = {
  init() {
    Preview.init();
    Validator.init();
    Store.setUI({ lastVisitedExercise: Store.getUI().lastVisitedExercise || null });
    Router.init();
    window.addEventListener('beforeunload', () => {
      if (Router._currentSlug) {
        Timer.pause();
        Store.setProgress(Router._currentSlug, {
          timerSeconds: Timer.seconds,
          timerRunning: false,
        });
      }
    });
  },

  // ── HOME VIEW ──────────────────────────────────────────────────────────────
  renderHomeView() {
    const footer = document.getElementById('site-footer');
    if (footer) footer.style.display = '';
    const container = document.getElementById('view-container');
    container.innerHTML = `
      <section class="home-view">
        <div class="home-hero">
          <h1 class="hero-title">Aprende<span class="accent">AI</span></h1>
          <p class="hero-subtitle">Exercícios práticos de JavaScript, HTML e CSS — do básico ao avançado.</p>
        </div>
        <div class="exercises-grid">
          ${EXERCISES_META.map(ex => this._renderCard(ex)).join('')}
        </div>
      </section>`;

    // Update cards with saved progress
    EXERCISES_META.forEach(ex => {
      UI.updateCard(ex.slug, Store.getProgress(ex.slug));
    });
  },

  _renderCard(ex) {
    return `
      <article class="exercise-card" data-slug="${ex.slug}">
        <div class="card-header">
          <span class="level-badge level-${ex.levelClass}">${ex.level}</span>
          <span class="status-chip not-started">○ Não iniciado</span>
        </div>
        <h2 class="card-title">${ex.title}</h2>
        <p class="card-description">${ex.description}</p>
        <div class="card-tags">
          ${ex.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span class="card-time" style="display:none"></span>
          <button class="card-btn btn-primary" onclick="Router.navigate('exercise/${ex.slug}')">Começar</button>
        </div>
      </article>`;
  },

  // ── EXERCISE VIEW ──────────────────────────────────────────────────────────
  renderExerciseView(slug) {
    const footer = document.getElementById('site-footer');
    if (footer) footer.style.display = 'none';
    const exercise = this._getExercise(slug);
    if (!exercise) { this.renderNotFoundView(); return; }

    const meta = EXERCISES_META.find(e => e.slug === slug);
    const progress = Store.getProgress(slug);
    const savedCode = Store.getCode(slug);
    const code = savedCode || exercise.scaffold;

    Store.setUI({ lastVisitedExercise: slug });
    if (!progress.startedAt) {
      Store.setProgress(slug, { startedAt: Date.now() });
    }

    const container = document.getElementById('view-container');
    container.innerHTML = `
      <div class="exercise-view">

        <!-- Exercise Header -->
        <header class="exercise-header">
          <div class="exercise-header-left">
            <button class="btn-icon home-btn" onclick="Router.navigate('')" title="Início">←</button>
            <h2 class="exercise-title">${exercise.title}</h2>
            <span class="level-badge level-${meta.levelClass}">${exercise.level}</span>
          </div>
          <div class="exercise-header-right">
            ${progress.completed ? '<span class="completed-badge">✓ Concluído</span>' : ''}
            <div class="timer-area">
              <span id="timer-display">00:00</span>
              <button class="btn-icon" id="btn-timer-toggle" title="Pausar/Retomar">⏸</button>
              <button class="btn-icon" id="btn-timer-reset" title="Resetar timer">↺</button>
            </div>
          </div>
        </header>

        <!-- Completion Banner -->
        <div id="completion-banner" class="completion-banner" style="display:none">
          <span>🎉 Exercício Concluído!</span>
          <span class="completion-time"></span>
        </div>

        <!-- Main Split Pane -->
        <div class="split-pane">

          <!-- LEFT PANE -->
          <div class="left-pane">
            <div class="pane-tabs">
              <button class="pane-tab-btn active" data-left-tab="instructions" onclick="UI.switchLeftTab('instructions')">Instruções</button>
              <button class="pane-tab-btn" data-left-tab="editor" onclick="UI.switchLeftTab('editor')">Editor</button>
            </div>

            <!-- Instructions Tab -->
            <div id="left-pane-instructions" class="pane-content">
              <p class="exercise-description">${exercise.description}</p>
              <h4>Requisitos:</h4>
              <ul id="checklist" class="checklist"></ul>
              <div id="hints-panel" class="hints-panel" style="display:none">
                <div class="hints-header">
                  <span class="hints-title">💡 Dicas</span>
                  <span id="hints-counter" class="hints-counter"></span>
                </div>
                <ul id="hints-list" class="hints-list"></ul>
                <button id="btn-next-hint" class="btn-next-hint">Ver próxima dica</button>
              </div>
            </div>

            <!-- Editor Tab -->
            <div id="left-pane-editor" class="pane-content" style="display:none">
              <div class="editor-tabs">
                <button class="editor-tab-btn active" data-lang="html" onclick="Editor.switchTab('html')">HTML</button>
                <button class="editor-tab-btn" data-lang="css" onclick="Editor.switchTab('css')">CSS</button>
                <button class="editor-tab-btn" data-lang="js" onclick="Editor.switchTab('js')">JS</button>
              </div>
              <div class="editor-wrapper">
                <textarea id="editor-html"></textarea>
                <textarea id="editor-css"></textarea>
                <textarea id="editor-js"></textarea>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="btn-primary btn-validate" id="btn-validate">▶ Validar Código</button>
              <button class="btn-secondary btn-reset" id="btn-reset">↺ Resetar</button>
              <button class="btn-hint" id="btn-hints" title="Ver dicas">💡</button>
            </div>
          </div>

          <!-- Resizer -->
          <div class="pane-resizer" id="pane-resizer" title="Arrastar para redimensionar"></div>

          <!-- RIGHT PANE -->
          <div class="right-pane">
            <div class="pane-tabs">
              <button class="pane-tab-btn active" data-right-tab="preview" onclick="UI.switchRightTab('preview')">Preview</button>
              <button class="pane-tab-btn" data-right-tab="example" onclick="App.openExample('${slug}')">Exemplo</button>
              <button class="pane-tab-btn" data-right-tab="solution" onclick="App.openSolution('${slug}')">Solução</button>
            </div>

            <!-- Preview -->
            <div id="right-pane-preview" class="pane-content iframe-pane">
              <iframe id="live-preview" sandbox="allow-scripts" title="Preview"></iframe>
            </div>

            <!-- Example -->
            <div id="right-pane-example" class="pane-content iframe-pane" style="display:none">
              <iframe id="example-frame" sandbox="allow-scripts" title="Exemplo"></iframe>
            </div>

            <!-- Solution -->
            <div id="right-pane-solution" class="pane-content solution-pane" style="display:none">
              <div id="solution-locked" class="solution-locked">
                <p>⚠️ Tente resolver o exercício antes de ver a solução!</p>
                <button class="btn-danger" id="btn-reveal-solution">Ver Solução mesmo assim</button>
              </div>
              <div id="solution-revealed" style="display:none">
                <div class="solution-code-tabs">
                  <button class="sol-tab-btn active" onclick="App.switchSolTab('html', this)">HTML</button>
                  <button class="sol-tab-btn" onclick="App.switchSolTab('css', this)">CSS</button>
                  <button class="sol-tab-btn" onclick="App.switchSolTab('js', this)">JS</button>
                </div>
                <pre id="solution-code-html" class="solution-code"><code></code></pre>
                <pre id="solution-code-css" class="solution-code" style="display:none"><code></code></pre>
                <pre id="solution-code-js" class="solution-code" style="display:none"><code></code></pre>
                <div class="solution-preview-area">
                  <p class="sol-preview-label">Resultado da solução:</p>
                  <iframe id="solution-frame" sandbox="allow-scripts" title="Solução"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hidden validation iframe -->
        <iframe id="validation-frame" sandbox="allow-scripts allow-same-origin" style="display:none" title="Validação"></iframe>
      </div>`;

    // Init pane resizer
    this._initPaneResizer();

    // Init hints
    this._initHints(exercise);

    // Init components
    Preview.init();
    Validator.init();
    UI.renderChecklist(exercise.rules);

    // Show completed banner if already done
    if (progress.completed) {
      UI.showCompletion(Timer.format(progress.timerSeconds));
    }

    // Init CodeMirror editor
    Editor.init(slug, code, (updatedCode) => {
      Preview.update(updatedCode.html, updatedCode.css, updatedCode.js);
    });

    // Initial preview render
    Preview.update(code.html, code.css, code.js);

    // Init timer
    Timer.init(progress.timerSeconds, !progress.completed, (sec, fmt) => {
      const el = document.getElementById('timer-display');
      if (el) el.textContent = fmt;
      Store.setProgress(slug, { timerSeconds: sec });
    });

    // If exercise is complete, don't auto-run timer
    if (progress.completed) {
      Timer.pause();
    }

    // Timer controls
    document.getElementById('btn-timer-toggle').addEventListener('click', () => {
      const btn = document.getElementById('btn-timer-toggle');
      if (Timer.running) {
        Timer.pause();
        btn.textContent = '▶';
        btn.title = 'Retomar';
      } else {
        Timer.resume();
        btn.textContent = '⏸';
        btn.title = 'Pausar';
      }
    });

    document.getElementById('btn-timer-reset').addEventListener('click', () => {
      UI.modal({
        title: 'Resetar Timer',
        message: 'Tem certeza que deseja resetar o timer para 00:00?',
        confirmLabel: 'Resetar',
        onConfirm: () => {
          Timer.reset();
          Store.setProgress(slug, { timerSeconds: 0 });
          const btn = document.getElementById('btn-timer-toggle');
          if (btn) { btn.textContent = '⏸'; btn.title = 'Pausar'; }
          Timer.start();
        },
      });
    });

    // Validate button
    document.getElementById('btn-validate').addEventListener('click', async () => {
      const btn = document.getElementById('btn-validate');

      // Block validation if JS has a syntax error
      if (Editor.hasSyntaxError()) {
        UI.switchLeftTab('editor');
        Editor.switchTab('js');
        UI.toast('Corrija o erro de sintaxe no JS antes de validar.', 'error');
        return;
      }

      btn.textContent = '⌛ Validando...';
      btn.disabled = true;

      const currentCode = Editor.getCode();
      const results = await Validator.run(slug, currentCode);
      UI.renderValidationResults(results);

      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        Timer.pause();
        const timeStr = Timer.format();
        Store.setProgress(slug, {
          completed: true,
          completedAt: Date.now(),
          timerSeconds: Timer.seconds,
        });
        UI.showCompletion(timeStr);
        UI.toast('🎉 Parabéns! Todos os requisitos foram atendidos!', 'success');
      } else {
        const passed = results.filter(r => r.passed).length;
        UI.toast(`${passed}/${results.length} requisitos passaram. Continue tentando!`, 'warning');
      }

      btn.textContent = '▶ Validar Código';
      btn.disabled = false;
    });

    // Reset button
    document.getElementById('btn-reset').addEventListener('click', () => {
      UI.modal({
        title: 'Resetar Código',
        message: 'Isso vai apagar todo o seu código e voltar ao scaffold inicial. Tem certeza?',
        confirmLabel: 'Resetar',
        onConfirm: () => {
          Editor.reset(exercise.scaffold);
          Preview.update(exercise.scaffold.html, exercise.scaffold.css, exercise.scaffold.js);
          UI.toast('Código resetado.', 'info');
        },
      });
    });
  },

  openExample(slug) {
    const exercise = this._getExercise(slug);
    UI.switchRightTab('example');
    if (exercise) Preview.loadExample(exercise);
  },

  openSolution(slug) {
    UI.switchRightTab('solution');
    document.getElementById('btn-reveal-solution').onclick = () => {
      const exercise = this._getExercise(slug);
      document.getElementById('solution-locked').style.display = 'none';
      document.getElementById('solution-revealed').style.display = 'block';
      // Fill code blocks
      document.querySelector('#solution-code-html code').textContent = exercise.solution.html;
      document.querySelector('#solution-code-css code').textContent = exercise.solution.css;
      document.querySelector('#solution-code-js code').textContent = exercise.solution.js;
      Preview.loadSolution(exercise);
    };
  },

  switchSolTab(lang, clickedBtn) {
    ['html', 'css', 'js'].forEach(l => {
      const el = document.getElementById(`solution-code-${l}`);
      if (el) el.style.display = l === lang ? 'block' : 'none';
    });
    document.querySelectorAll('.sol-tab-btn').forEach(b => b.classList.remove('active'));
    clickedBtn.classList.add('active');
  },

  _initHints(exercise) {
    const hints = exercise.hints || [];
    const btnHints = document.getElementById('btn-hints');
    const panel = document.getElementById('hints-panel');
    const list = document.getElementById('hints-list');
    const counter = document.getElementById('hints-counter');
    const btnNext = document.getElementById('btn-next-hint');
    if (!btnHints || !panel) return;

    let revealed = 0;

    btnHints.addEventListener('click', () => {
      if (hints.length === 0) { UI.toast('Nenhuma dica disponível para este exercício.', 'info'); return; }
      panel.style.display = 'block';
      // Switch to instructions tab if not visible
      UI.switchLeftTab('instructions');
      if (revealed === 0) revealNext();
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    function revealNext() {
      if (revealed >= hints.length) return;
      const li = document.createElement('li');
      li.className = 'hint-item';
      li.innerHTML = `<span class="hint-number">${revealed + 1}</span><span class="hint-text">${hints[revealed]}</span>`;
      list.appendChild(li);
      revealed++;
      counter.textContent = `${revealed}/${hints.length}`;
      btnNext.style.display = revealed >= hints.length ? 'none' : 'block';
    }

    btnNext.addEventListener('click', revealNext);
  },

  _initPaneResizer() {
    const resizer = document.getElementById('pane-resizer');
    const leftPane = document.querySelector('.left-pane');
    const splitPane = document.querySelector('.split-pane');
    if (!resizer || !leftPane || !splitPane) return;

    let dragging = false;
    let startX = 0;
    let startWidth = 0;

    resizer.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startWidth = leftPane.offsetWidth;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      resizer.classList.add('dragging');
      // Overlay over iframes so they don't swallow mouse events
      document.querySelectorAll('iframe').forEach(f => {
        f.style.pointerEvents = 'none';
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const delta = e.clientX - startX;
      const newWidth = startWidth + delta;
      leftPane.style.width = newWidth + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      resizer.classList.remove('dragging');
      // Restore iframe pointer events
      document.querySelectorAll('iframe').forEach(f => {
        f.style.pointerEvents = '';
      });
      // Refresh CodeMirror after resize
      if (typeof Editor !== 'undefined') {
        ['html', 'css', 'js'].forEach(lang => {
          if (Editor._instances[lang]) Editor._instances[lang].refresh();
        });
      }
    });
  },

  renderNotFoundView() {
    document.getElementById('view-container').innerHTML = `
      <div class="not-found">
        <h2>Exercício não encontrado</h2>
        <p>O exercício que você procura não existe.</p>
        <button class="btn-primary" onclick="Router.navigate('')">← Voltar ao início</button>
      </div>`;
  },

  _getExercise(slug) {
    const map = {
      'color-counter': typeof EASY_EXERCISE !== 'undefined' ? EASY_EXERCISE : null,
      'todo-list': typeof MEDIUM_EXERCISE !== 'undefined' ? MEDIUM_EXERCISE : null,
      'quiz-app': typeof HARD_EXERCISE !== 'undefined' ? HARD_EXERCISE : null,
    };
    return map[slug] || null;
  },
};

// Bootstrap
document.addEventListener('DOMContentLoaded', () => App.init());
