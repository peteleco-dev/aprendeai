// timer.js — lógica do timer do exercício
const Timer = (() => {
  let seconds = 0;
  let intervalId = null;
  let onTick = null;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function format(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${pad(m)}:${pad(sec)}`;
  }

  function tick() {
    seconds++;
    if (onTick) onTick(seconds, format(seconds));
  }

  return {
    get seconds() { return seconds; },
    get running() { return intervalId !== null; },

    init(savedSeconds, savedRunning, tickCallback) {
      seconds = savedSeconds || 0;
      onTick = tickCallback;
      if (savedRunning !== false) {
        this.start();
      } else {
        // Just update display without starting
        if (onTick) onTick(seconds, format(seconds));
      }
    },

    start() {
      if (intervalId) return;
      intervalId = setInterval(tick, 1000);
    },

    pause() {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    },

    resume() {
      this.start();
    },

    reset() {
      this.pause();
      seconds = 0;
      if (onTick) onTick(0, format(0));
    },

    destroy() {
      this.pause();
      onTick = null;
    },

    format(s) {
      return format(s !== undefined ? s : seconds);
    },
  };
})();
