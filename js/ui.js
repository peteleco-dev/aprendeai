// ui.js — helpers DOM, toast, modal, confetti, resultados de validação
const UI = {
  // ── Toast ──────────────────────────────────────────────────────────────────
  toast(message, type = 'info') {
    const existing = document.getElementById('toast-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = `toast toast-${type}`;
    container.textContent = message;
    document.body.appendChild(container);

    requestAnimationFrame(() => container.classList.add('show'));
    setTimeout(() => {
      container.classList.remove('show');
      setTimeout(() => container.remove(), 300);
    }, 3000);
  },

  // ── Modal ──────────────────────────────────────────────────────────────────
  modal({ title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <h3 class="modal-title">${title}</h3>
        <p class="modal-message">${message}</p>
        <div class="modal-actions">
          <button class="btn-secondary" id="modal-cancel">${cancelLabel}</button>
          <button class="btn-danger" id="modal-confirm">${confirmLabel}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    document.getElementById('modal-cancel').addEventListener('click', () => overlay.remove());
    document.getElementById('modal-confirm').addEventListener('click', () => {
      overlay.remove();
      if (onConfirm) onConfirm();
    });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  },

  // ── Validation Results ─────────────────────────────────────────────────────
  renderValidationResults(results) {
    const list = document.getElementById('checklist');
    if (!list) return;

    const items = list.querySelectorAll('.check-item');
    items.forEach((item, i) => {
      if (results[i] !== undefined) {
        item.classList.remove('passed', 'failed', 'pending');
        item.classList.add(results[i].passed ? 'passed' : 'failed');
        const icon = item.querySelector('.check-icon');
        if (icon) icon.textContent = results[i].passed ? '✓' : '✗';
      }
    });
  },

  renderChecklist(rules) {
    const list = document.getElementById('checklist');
    if (!list) return;
    list.innerHTML = rules.map(rule => `
      <li class="check-item pending" data-id="${rule.id}">
        <span class="check-icon">○</span>
        <span class="check-label">${rule.label}</span>
      </li>`).join('');
  },

  // ── Completion Banner ──────────────────────────────────────────────────────
  showCompletion(timeStr) {
    const banner = document.getElementById('completion-banner');
    if (banner) {
      banner.style.display = 'flex';
      banner.querySelector('.completion-time').textContent = `Tempo: ${timeStr}`;
    }
    this.launchConfetti();
  },

  hideCompletion() {
    const banner = document.getElementById('completion-banner');
    if (banner) banner.style.display = 'none';
  },

  // ── Confetti ───────────────────────────────────────────────────────────────
  launchConfetti() {
    const colors = ['#7c3aed', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899'];
    const count = 80;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.cssText = `
          left: ${Math.random() * 100}vw;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          animation-duration: ${1.5 + Math.random() * 2}s;
          animation-delay: ${Math.random() * 0.5}s;
          width: ${6 + Math.random() * 8}px;
          height: ${6 + Math.random() * 8}px;
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
      }, i * 20);
    }
  },

  // ── Progress Card Update ───────────────────────────────────────────────────
  updateCard(slug, progress) {
    const card = document.querySelector(`[data-slug="${slug}"]`);
    if (!card) return;

    const chip = card.querySelector('.status-chip');
    const timeEl = card.querySelector('.card-time');
    const btn = card.querySelector('.card-btn');

    if (chip) {
      chip.className = 'status-chip';
      if (progress.completed) {
        chip.classList.add('completed');
        chip.textContent = '✓ Concluído';
      } else if (progress.timerSeconds > 0) {
        chip.classList.add('in-progress');
        chip.textContent = '● Em progresso';
      } else {
        chip.classList.add('not-started');
        chip.textContent = '○ Não iniciado';
      }
    }

    if (timeEl && progress.timerSeconds > 0) {
      const m = Math.floor(progress.timerSeconds / 60);
      const s = progress.timerSeconds % 60;
      timeEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      timeEl.style.display = 'block';
    }

    if (btn) {
      btn.textContent = progress.completed ? 'Revisar' : progress.timerSeconds > 0 ? 'Continuar' : 'Começar';
    }
  },

  // ── Right Pane Tab Switching ───────────────────────────────────────────────
  switchRightTab(tab) {
    ['preview', 'example', 'solution'].forEach(t => {
      const pane = document.getElementById(`right-pane-${t}`);
      const btn = document.querySelector(`[data-right-tab="${t}"]`);
      if (pane) pane.style.display = t === tab ? 'block' : 'none';
      if (btn) btn.classList.toggle('active', t === tab);
    });
  },

  // ── Left Pane Tab Switching ────────────────────────────────────────────────
  switchLeftTab(tab) {
    ['instructions', 'editor'].forEach(t => {
      const pane = document.getElementById(`left-pane-${t}`);
      const btn = document.querySelector(`[data-left-tab="${t}"]`);
      if (pane) pane.style.display = t === tab ? (t === 'editor' ? 'flex' : 'block') : 'none';
      if (btn) btn.classList.toggle('active', t === tab);
    });
    // Refresh CodeMirror instances after editor pane becomes visible
    if (tab === 'editor') {
      setTimeout(() => {
        if (typeof Editor !== 'undefined') {
          ['html', 'css', 'js'].forEach(lang => {
            if (Editor._instances[lang]) Editor._instances[lang].refresh();
          });
        }
      }, 20);
    }
  },
};
