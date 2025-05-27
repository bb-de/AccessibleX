(function () {
  'use strict';

  if (window.AccessibleXWidget) return;
  window.AccessibleXWidget = true;

  function showPanel() {
    const panel = document.getElementById('accessibility-panel');
    if (panel) {
      panel.classList.remove('translate-y-[-100%]', 'opacity-0', 'invisible');
      panel.classList.add('translate-y-0', 'opacity-100', 'visible');
      panel.setAttribute('aria-hidden', 'false');
    } else {
      console.warn('Widget panel not found');
    }
  }

  function createWidgetButton() {
    const button = document.createElement('button');
    const img = document.createElement('img');

    img.src = 'https://accessiblex.netlify.app/assets/widget-button-logo-Z7cPO0dw.png';
    img.alt = 'Barrierefreiheit öffnen';
    img.style.width = '64px';
    img.style.height = '64px';
    img.style.display = 'block';
    img.style.borderRadius = '50%';

    button.appendChild(img);
    button.setAttribute('aria-label', 'Barrierefreiheit öffnen');

    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      z-index: 999998;
    `;

    button.addEventListener('click', showPanel);
    document.body.appendChild(button);
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createWidgetButton);
    } else {
      createWidgetButton();
    }
  }

  init();
})();
