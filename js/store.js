// store.js — camada de acesso ao localStorage
const KEYS = {
  PROGRESS: 'aprendeai_progress',
  UI: 'aprendeai_ui',
  CODE: (slug) => `aprendeai_code_${slug}`,
};

const DEFAULT_PROGRESS = {
  completed: false,
  timerSeconds: 0,
  startedAt: null,
  completedAt: null,
};

const Store = {
  getAllProgress() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.PROGRESS)) || {};
    } catch {
      return {};
    }
  },

  getProgress(slug) {
    const all = this.getAllProgress();
    return all[slug] ? { ...DEFAULT_PROGRESS, ...all[slug] } : { ...DEFAULT_PROGRESS };
  },

  setProgress(slug, patch) {
    const all = this.getAllProgress();
    all[slug] = { ...DEFAULT_PROGRESS, ...(all[slug] || {}), ...patch };
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify(all));
  },

  getCode(slug) {
    try {
      return JSON.parse(localStorage.getItem(KEYS.CODE(slug))) || null;
    } catch {
      return null;
    }
  },

  setCode(slug, code) {
    localStorage.setItem(KEYS.CODE(slug), JSON.stringify(code));
  },

  getUI() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.UI)) || {};
    } catch {
      return {};
    }
  },

  setUI(patch) {
    const current = this.getUI();
    localStorage.setItem(KEYS.UI, JSON.stringify({ ...current, ...patch }));
  },
};
