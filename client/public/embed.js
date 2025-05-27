
(function () {
  'use strict';

  if (window.AccessibleXWidget) return;
  window.AccessibleXWidget = true;

  function openWidgetIframe() {
    if (document.getElementById('accessiblex-iframe')) return;

    const iframe = document.createElement('iframe');
    iframe.id = 'accessiblex-iframe';
    iframe.src = 'https://accessiblex.netlify.app/widget.html';
    iframe.title = 'AccessibleX Widget';
    iframe.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 360px;
      height: 600px;
      border: none;
      z-index: 999999;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      border-radius: 12px 12px 0 0;
    `;

    document.body.appendChild(iframe);
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

    button.addEventListener('click', openWidgetIframe);
    document.body.appendChild(button);
  }

  function handleMessage(event) {
    const msg = event.data;
    if (typeof msg !== 'object' || !msg.type) return;

    switch (msg.type) {
      case 'increase-font':
        document.body.style.fontSize = '1.25em';
        break;
      case 'high-contrast':
        document.documentElement.classList.add('accessiblex-contrast');
        break;
      case 'highlight-links':
        document.querySelectorAll('a').forEach(link => {
          link.style.outline = '3px solid #f00';
          link.style.backgroundColor = '#ff0';
        });
        break;
      case 'dyslexia-font':
        document.body.style.fontFamily = '"Comic Sans MS", "Arial", sans-serif';
        break;
      case 'reset':
        document.body.style.fontSize = '';
        document.documentElement.classList.remove('accessiblex-contrast');
        document.body.style.fontFamily = '';
        document.querySelectorAll('a').forEach(link => {
          link.style.outline = '';
          link.style.backgroundColor = '';
        });
        break;
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createWidgetButton();
        window.addEventListener('message', handleMessage);
      });
    } else {
      createWidgetButton();
      window.addEventListener('message', handleMessage);
    }
  }

  init();
})();
 
