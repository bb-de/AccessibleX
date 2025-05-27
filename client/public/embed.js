(function () {
  'use strict';

  if (window.AccessibleXWidget) return;
  window.AccessibleXWidget = true;

  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];

  const config = {
    position: currentScript.dataset.position || 'bottom-right',
    widgetUrl: currentScript.dataset.widgetUrl || 'https://accessiblex.netlify.app',
    iconUrl: currentScript.dataset.icon || 'https://accessiblex.netlify.app/assets/widget-button-logo-Z7cPO0dw.png',
  };

  function loadWidget() {
    const iframe = document.createElement('iframe');
    iframe.src = config.widgetUrl;
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      background: transparent;
      pointer-events: none;
      z-index: 999999;
    `;
    iframe.onload = () => { iframe.style.pointerEvents = 'auto'; };
    document.body.appendChild(iframe);
  }

  function createWidgetButton() {
    const button = document.createElement('button');
    const img = document.createElement('img');

    img.src = config.iconUrl;
    img.alt = 'Barrierefreiheits-Widget öffnen';
    img.style.width = '64px';
    img.style.height = '64px';
    img.style.display = 'block';

    button.appendChild(img);
    button.setAttribute('aria-label', 'Barrierefreiheit öffnen');

    button.style.cssText = `
      position: fixed;
      ${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      z-index: 999998;
    `;

    button.addEventListener('click', loadWidget);
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
