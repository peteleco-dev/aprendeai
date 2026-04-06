// validator.js — motor de validação via iframe oculto com same-origin
const Validator = {
  _frame: null,

  init() {
    this._frame = document.getElementById('validation-frame');
  },

  _loadCode(html, css, js) {
    return new Promise((resolve) => {
      const doc = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>${css}</style>
</head>
<body>
${html}
<script>
(function() {
  try { ${js} } catch(e) { /* swallow errors during validation load */ }
})();
</script>
</body>
</html>`;
      this._frame.onload = () => resolve();
      this._frame.srcdoc = doc;
    });
  },

  async run(slug, code) {
    const exercise = this._getExercise(slug);
    if (!exercise) return [];

    await this._loadCode(code.html, code.css, code.js);
    // Give JS a bit more time to execute after load
    await new Promise(r => setTimeout(r, 200));

    const results = [];
    for (const rule of exercise.rules) {
      let passed = false;
      try {
        passed = await rule.test(this._frame.contentDocument, code);
      } catch (e) {
        passed = false;
      }
      results.push({ id: rule.id, label: rule.label, passed });
    }
    return results;
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
