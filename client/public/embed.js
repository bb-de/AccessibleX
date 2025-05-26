/**
 * Embeddable Accessibility Widget Script
 * This script can be included on any website to add the accessibility widget.
 */

(function() {
  const DEFAULT_CONFIG = {
    position: 'bottom-right',
    language: 'de',
    color: '#0055A4',
    apiEndpoint: 'https://api.brandingbrothers.de/accessibility',
    widgetLogo: '',
    tokenId: ''
  };

  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];

  const config = { ...DEFAULT_CONFIG };
  for (const key in DEFAULT_CONFIG) {
    if (currentScript.dataset[key]) {
      config[key] = currentScript.dataset[key];
    }
  }

  function loadStyles() {
    const styleTag = document.createElement('style');
    styleTag.textContent =
      '#accessibility-widget-container * {' +
      '  box-sizing: border-box;' +
      '  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;' +
      '}' +
      '#accessibility-widget-button {' +
      '  position: fixed;' +
      '  z-index: 9998;' +
      '  width: 48px;' +
      '  height: 48px;' +
      '  border-radius: 50%;' +
      '  background-color: ' + config.color + ';' +
      '  color: white;' +
      '  border: none;' +
      '  display: flex;' +
      '  align-items: center;' +
      '  justify-content: center;' +
      '  cursor: pointer;' +
      '  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);' +
      '  transition: all 0.3s ease;' +
      '}' +
      '#accessibility-widget-button:hover {' +
      '  transform: scale(1.1);' +
      '  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);' +
      '}' +
      '#accessibility-widget-button svg {' +
      '  width: 28px;' +
      '  height: 28px;' +
      '}' +
      '#accessibility-widget-button.bottom-right { bottom: 20px; right: 20px; }' +
      '#accessibility-widget-button.bottom-left { bottom: 20px; left: 20px; }' +
      '#accessibility-widget-button.top-right { top: 20px; right: 20px; }' +
      '#accessibility-widget-button.top-left { top: 20px; left: 20px; }';
    document.head.appendChild(styleTag);
  }

  function createWidgetButton() {
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';

    const button = document.createElement('button');
    button.id = 'accessibility-widget-button';
    button.className = config.position;
    button.setAttribute('aria-label', 'Open accessibility menu');
    button.setAttribute('type', 'button');

    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4M12 16h.01"></path>
      </svg>
    `;

    container.appendChild(button);
    document.body.appendChild(container);

    return button;
  }

  function createWidgetIframe() {
    const iframe = document.createElement('iframe');
    iframe.id = 'accessibility-widget-iframe';
    iframe.style.position = 'fixed';
    iframe.style.zIndex = '9999';
    iframe.style.border = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.transition = 'opacity 0.3s ease';

    switch (config.position) {
      case 'bottom-right':
        iframe.style.bottom = '80px';
        iframe.style.right = '20px';
        break;
      case 'bottom-left':
        iframe.style.bottom = '80px';
        iframe.style.left = '20px';
        break;
      case 'top-right':
        iframe.style.top = '80px';
        iframe.style.right = '20px';
        break;
      case 'top-left':
        iframe.style.top = '80px';
        iframe.style.left = '20px';
        break;
    }

    document.body.appendChild(iframe);
    return iframe;
  }

  function initWidget() {
    loadStyles();
    const button = createWidgetButton();
    const iframe = createWidgetIframe();

    const iframeSrc = new URL(config.apiEndpoint + '/widget-embed');
    Object.keys(config).forEach(key => {
      iframeSrc.searchParams.append(key, String(config[key]));
    });
    iframe.src = iframeSrc.toString();

    let isOpen = false;

    function toggleWidget() {
      isOpen = !isOpen;

      if (isOpen) {
        iframe.style.width = '340px';
        iframe.style.height = '500px';
        iframe.style.opacity = '1';
        iframe.style.pointerEvents = 'auto';
        button.setAttribute('aria-expanded', 'true');
      } else {
        iframe.style.opacity = '0';
        setTimeout(() => {
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.pointerEvents = 'none';
        }, 300);
        button.setAttribute('aria-expanded', 'false');
      }

      iframe.contentWindow?.postMessage({
        type: 'accessibility-widget-toggle',
        isOpen
      }, '*');
    }

    button.addEventListener('click', toggleWidget);

    window.addEventListener('message', (event) => {
      if (event.source !== iframe.contentWindow) return;
      const { type } = event.data;

      if (type === 'accessibility-widget-ready') {
        console.log('Accessibility widget ready');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
