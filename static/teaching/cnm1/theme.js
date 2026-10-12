(function () {
  const root = document.documentElement;

  function applyTheme() {
    root.classList.toggle('light', localStorage.getItem('pref-theme') === 'light');
    root.classList.toggle('dark', localStorage.getItem('pref-theme') !== 'light');
    root.setAttribute('data-accent', localStorage.getItem('pref-accent') || 'blue');
  }

  applyTheme();
  window.addEventListener('storage', applyTheme);
})();
