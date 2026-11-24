(function () {
  const root = document.documentElement;

  function applyTheme() {
    root.classList.toggle('light', localStorage.getItem('pref-theme') === 'light');
    root.classList.toggle('dark', localStorage.getItem('pref-theme') !== 'light');
    root.setAttribute('data-accent', localStorage.getItem('pref-accent') || 'purple');
  }

  /* Inside a class page the demo sits in an iframe under a panel that already
     names it, so the page drops its own title and footer (see theme.css). */
  if (window.parent !== window) root.classList.add('embedded');

  applyTheme();
  window.addEventListener('storage', applyTheme);
})();
