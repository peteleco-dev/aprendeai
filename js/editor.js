// editor.js — gerencia instâncias CodeMirror + auto-save + preview debounce
const Editor = {
  _instances: {},     // { html, css, js } — CodeMirror instances
  _currentTab: 'html',
  _slug: null,
  _debounceTimer: null,
  _onChangeCallback: null,
  _syntaxBarEl: null,
  _syntaxErrorLine: null,
  _hasSyntaxError: false,

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

    // JS syntax checker — runs on every JS change
    if (this._instances.js) {
      this._instances.js.on('change', () => {
        this._checkAndRenderSyntax(this._instances.js.getValue());
      });
    }

    // Show only the active tab editor
    this._initSyntaxBar();
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
    // Show syntax bar only on JS tab
    if (this._syntaxBarEl) {
      this._syntaxBarEl.style.display = (lang === 'js' && this._hasSyntaxError) ? 'flex' : 'none';
    }
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

  // ── Syntax Checking ───────────────────────────────────────────────────────

  _initSyntaxBar() {
    const editorTabs = document.querySelector('.editor-tabs');
    if (!editorTabs) return;
    const bar = document.createElement('div');
    bar.className = 'js-syntax-bar';
    bar.style.display = 'none';
    editorTabs.insertAdjacentElement('afterend', bar);
    this._syntaxBarEl = bar;
  },

  _checkAndRenderSyntax(jsCode) {
    this._clearSyntaxMark();

    if (!jsCode || !jsCode.trim()) {
      this._hasSyntaxError = false;
      if (this._syntaxBarEl) this._syntaxBarEl.style.display = 'none';
      return;
    }

    let syntaxError = null;
    try {
      new Function(jsCode); // eslint-disable-line no-new-func
    } catch (e) {
      if (e instanceof SyntaxError) syntaxError = e;
    }

    if (!syntaxError) {
      this._hasSyntaxError = false;
      if (this._syntaxBarEl) this._syntaxBarEl.style.display = 'none';
      return;
    }

    // Extract line number from V8 stack: "<anonymous>:N:M"
    const stackMatch = syntaxError.stack && syntaxError.stack.match(/<anonymous>:(\d+)/);
    const lineNum = stackMatch ? parseInt(stackMatch[1], 10) : null; // 1-indexed

    // Mark error line in CodeMirror (0-indexed)
    const cm = this._instances.js;
    if (cm && lineNum !== null) {
      const cmLine = lineNum - 1;
      if (cmLine >= 0 && cmLine < cm.lineCount()) {
        cm.addLineClass(cmLine, 'background', 'cm-error-line');
        this._syntaxErrorLine = cmLine;
      }
    }

    this._hasSyntaxError = true;

    if (this._syntaxBarEl && this._currentTab === 'js') {
      const lineStr = lineNum ? ` — linha ${lineNum}` : '';
      this._syntaxBarEl.innerHTML =
        `<span class="syntax-bar-icon">✗</span>` +
        `<span class="syntax-bar-msg">${syntaxError.message}${lineStr}</span>`;
      this._syntaxBarEl.style.display = 'flex';
    }
  },

  _clearSyntaxMark() {
    const cm = this._instances.js;
    if (cm && this._syntaxErrorLine !== null) {
      cm.removeLineClass(this._syntaxErrorLine, 'background', 'cm-error-line');
      this._syntaxErrorLine = null;
    }
  },

  hasSyntaxError() {
    return this._hasSyntaxError;
  },

  destroy() {
    clearTimeout(this._debounceTimer);
    this._clearSyntaxMark();
    if (this._syntaxBarEl) { this._syntaxBarEl.remove(); this._syntaxBarEl = null; }
    ['html', 'css', 'js'].forEach(lang => {
      if (this._instances[lang]) {
        this._instances[lang].toTextArea();
      }
    });
    this._instances = {};
    this._slug = null;
    this._onChangeCallback = null;
    this._hasSyntaxError = false;
  },
};
