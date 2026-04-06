// preview.js — live preview via iframe srcdoc
const Preview = {
  _frame: null,

  init() {
    this._frame = document.getElementById('live-preview');
  },

  buildDocument(html, css, js) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
</head>
<body>
${html}
<script>
(function() {
  try {
    ${js}
  } catch(e) {
    var div = document.createElement('div');
    div.style.cssText = 'position:fixed;bottom:0;left:0;right:0;padding:10px 14px;background:#fef2f2;color:#ef4444;font-family:monospace;font-size:13px;border-top:2px solid #ef4444;z-index:9999';
    div.textContent = '⚠ Erro: ' + e.message;
    document.body.appendChild(div);
  }
})();
</script>
</body>
</html>`;
  },

  update(html, css, js) {
    if (!this._frame) return;
    this._frame.srcdoc = this.buildDocument(html, css, js);
  },

  loadExample(exercise) {
    const frame = document.getElementById('example-frame');
    if (!frame) return;
    frame.srcdoc = this.buildDocument(
      exercise.example.html,
      exercise.example.css,
      exercise.example.js
    );
  },

  loadSolution(exercise) {
    const frame = document.getElementById('solution-frame');
    if (!frame) return;
    frame.srcdoc = this.buildDocument(
      exercise.solution.html,
      exercise.solution.css,
      exercise.solution.js
    );
  },
};
