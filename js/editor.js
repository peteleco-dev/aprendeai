// editor.js — gerencia instâncias CodeMirror + auto-save + preview debounce
const Editor = {
  _instances: {},     // { html, css, js } — CodeMirror instances
  _currentTab: 'html',
  _slug: null,
  _debounceTimer: null,
  _onChangeCallback: null,

  init(slug, initialCode, onChangeCallback) {
    this._slug = slug;
    this._onChangeCallback = onChangeCallback;
    this._currentTab = 'html';

    const modes = { html: 'htmlmixed', css: 'css', js: 'javascript' };
    const textareas = { html: 'editor-html', css: 'editor-css', js: 'editor-js' };

    ['html', 'css', 'js'].forEach(lang => {
      const ta = document.getElementById(textareas[lang]);
      if (!ta) return;
      ta.value = initialCode[lang] || '';

      this._instances[lang] = CodeMirror.fromTextArea(ta, {
        mode: modes[lang],
        theme: 'dracula',
        lineNumbers: true,
        tabSize: 2,
        indentWithTabs: false,
        lineWrapping: false,
        autoCloseBrackets: true,
        autoCloseTags: lang === 'html',
        matchBrackets: true,
        styleActiveLine: true,
        extraKeys: {
          'Tab': (cm) => cm.execCommand('indentMore'),
          'Shift-Tab': (cm) => cm.execCommand('indentLess'),
        },
      });

      this._instances[lang].on('change', () => this._scheduleUpdate());
    });

    // Show only the active tab editor
    this._showTab('html');
  },

  _scheduleUpdate() {
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      const code = this.getCode();
      Store.setCode(this._slug, code);
      if (this._onChangeCallback) this._onChangeCallback(code);
    }, 500);
  },

  _showTab(lang) {
    ['html', 'css', 'js'].forEach(l => {
      const wrapper = this._instances[l] && this._instances[l].getWrapperElement();
      if (wrapper) wrapper.style.display = l === lang ? 'block' : 'none';
    });
    document.querySelectorAll('.editor-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    this._currentTab = lang;
    // Refresh CodeMirror to fix rendering after display:none
    if (this._instances[lang]) {
      setTimeout(() => this._instances[lang].refresh(), 10);
    }
  },

  switchTab(lang) {
    this._showTab(lang);
  },

  getCode() {
    return {
      html: this._instances.html ? this._instances.html.getValue() : '',
      css: this._instances.css ? this._instances.css.getValue() : '',
      js: this._instances.js ? this._instances.js.getValue() : '',
    };
  },

  setCode(code) {
    ['html', 'css', 'js'].forEach(lang => {
      if (this._instances[lang] && code[lang] !== undefined) {
        this._instances[lang].setValue(code[lang]);
      }
    });
  },

  reset(scaffoldCode) {
    this.setCode(scaffoldCode);
    Store.setCode(this._slug, scaffoldCode);
    const code = this.getCode();
    if (this._onChangeCallback) this._onChangeCallback(code);
  },

  destroy() {
    clearTimeout(this._debounceTimer);
    ['html', 'css', 'js'].forEach(lang => {
      if (this._instances[lang]) {
        this._instances[lang].toTextArea();
      }
    });
    this._instances = {};
    this._slug = null;
    this._onChangeCallback = null;
  },
};
