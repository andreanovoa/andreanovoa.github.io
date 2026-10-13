document.querySelectorAll('.module-demo').forEach((panel) => {
  panel.addEventListener('toggle', () => {
    if (panel.open) {
      document.querySelectorAll('.module-demo[open]').forEach((other) => {
        if (other !== panel) other.open = false;
      });
    }
  });
});

document.querySelectorAll('.module-demo-frame').forEach((frame) => {
  function fitFrame() {
    const doc = frame.contentDocument;
    if (!doc || !doc.body) return;

    const resize = () => {
      frame.style.height = Math.max(800, doc.documentElement.scrollHeight, doc.body.scrollHeight) + 'px';
    };
    frame._fitFrame = resize;

    if (!frame._resizeObserver) {
      frame._resizeObserver = new ResizeObserver(() => requestAnimationFrame(resize));
      frame._resizeObserver.observe(doc.documentElement);
      frame._resizeObserver.observe(doc.body);
    }
    if (!frame._contentObserver) {
      frame._contentObserver = new MutationObserver(() => requestAnimationFrame(resize));
      frame._contentObserver.observe(doc.body, { childList: true, subtree: true });
    }
    resize();
  }

  frame.addEventListener('load', fitFrame);
  if (frame.contentDocument?.readyState === 'complete') fitFrame();
});

window.addEventListener('message', (event) => {
  if (event.origin !== location.origin || event.data?.type !== 'module-demo-resize') return;
  const frame = [...document.querySelectorAll('.module-demo-frame')]
    .find((candidate) => candidate.contentWindow === event.source);
  frame?._fitFrame?.();
});
