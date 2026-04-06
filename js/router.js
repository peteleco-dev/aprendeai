// router.js — roteamento hash-based
const Router = {
  _currentSlug: null,

  init() {
    window.addEventListener('hashchange', () => this._handleRoute());
    this._handleRoute();
  },

  navigate(path) {
    window.location.hash = path;
  },

  _handleRoute() {
    // Pause timer and save state before unmounting
    if (this._currentSlug) {
      Timer.pause();
      Store.setProgress(this._currentSlug, {
        timerSeconds: Timer.seconds,
        timerRunning: false,
      });
      Timer.destroy();
      Editor.destroy();
      this._currentSlug = null;
    }

    const hash = window.location.hash.replace(/^#\/?/, '') || '';
    const parts = hash.split('/');

    if (parts[0] === 'exercise' && parts[1]) {
      const slug = parts[1];
      const validSlugs = EXERCISES_META.map(e => e.slug);
      if (validSlugs.includes(slug)) {
        this._currentSlug = slug;
        App.renderExerciseView(slug);
      } else {
        App.renderNotFoundView();
      }
    } else {
      App.renderHomeView();
    }
  },
};
