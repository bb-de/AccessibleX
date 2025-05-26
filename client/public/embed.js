/**
 * AccessibleX Simple Embed Script
 * Lädt nur das Widget-Panel ohne die komplette Website
 */

(function() {
  // Konfiguration
  const DEFAULT_CONFIG = {
    position: 'bottom-right',
    language: 'de',
    color: '#0055A4',
    widgetLogo: '',
    tokenId: ''
  };

  // Script-Tag Konfiguration laden
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  
  const config = Object.assign({}, DEFAULT_CONFIG);
  for (const key in DEFAULT_CONFIG) {
    if (currentScript.dataset[key]) {
      config[key] = currentScript.dataset[key];
    }
  }

  // Widget Button erstellen
  function createWidgetButton() {
    const button = document.createElement('button');
    button.id = 'accessiblex-widget-button';
    button.setAttribute('aria-label', 'Barrierefreiheits-Menü öffnen');
    button.style.cssText = `
      position: fixed;
      z-index: 999999;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: ${config.color};
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      ${getPositionStyles(config.position)}
    `;
    
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5l-4.24-4.24M7.76 16.24l-4.24 4.24m0-11.31l4.24 4.24m8.48 8.48l4.24-4.24"></path>
      </svg>
    `;
    
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.25)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    });
    
    document.body.appendChild(button);
    return button;
  }

  // Widget iframe erstellen (nur das Panel)
  function createWidgetIframe() {
    const iframe = document.createElement('iframe');
    iframe.id = 'accessiblex-widget-iframe';
    iframe.src = `https://accessiblex.netlify.app/?embed=true&position=${config.position}&color=${encodeURIComponent(config.color)}&language=${config.language}`;
    iframe.style.cssText = `
      position: fixed;
      z-index: 999998;
      width: 350px;
      height: 500px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      background: white;
      opacity: 0;
      transform: scale(0.8) translateY(20px);
      transition: all 0.3s ease;
      pointer-events: none;
      ${getPanelPositionStyles(config.position)}
    `;
    
    iframe.setAttribute('title', 'Barrierefreiheits-Widget');
    iframe.setAttribute('allowtransparency', 'true');
    
    document.body.appendChild(iframe);
    return iframe;
  }

  // Position Styles für Button
  function getPositionStyles(position) {
    switch(position) {
      case 'bottom-right':
        return 'bottom: 20px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      default:
        return 'bottom: 20px; right: 20px;';
    }
  }

  // Position Styles für Panel
  function getPanelPositionStyles(position) {
    switch(position) {
      case 'bottom-right':
        return 'bottom: 80px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 80px; left: 20px;';
      case 'top-right':
        return 'top: 80px; right: 20px;';
      case 'top-left':
        return 'top: 80px; left: 20px;';
      default:
        return 'bottom: 80px; right: 20px;';
    }
  }

  // Widget öffnen/schließen
  function setupToggleFunction() {
    const button = document.getElementById('accessiblex-widget-button');
    const iframe = document.getElementById('accessiblex-widget-iframe');
    
    let isOpen = false;
    
    function toggleWidget() {
      isOpen = !isOpen;
      
      if (isOpen) {
        iframe.style.opacity = '1';
        iframe.style.transform = 'scale(1) translateY(0)';
        iframe.style.pointerEvents = 'auto';
        button.setAttribute('aria-expanded', 'true');
      } else {
        iframe.style.opacity = '0';
        iframe.style.transform = 'scale(0.8) translateY(20px)';
        iframe.style.pointerEvents = 'none';
        button.setAttribute('aria-expanded', 'false');
      }
    }
    
    button.addEventListener('click', toggleWidget);
    
    // Nachrichten vom iframe empfangen
    window.addEventListener('message', function(event) {
      if (event.origin !== 'https://accessiblex.netlify.app') {
        return;
      }
      
      if (event.data.type === 'accessibility-widget-close') {
        if (isOpen) {
          toggleWidget();
        }
      }
    });
  }

  // Initialisierung
  function init() {
    // Prüfen ob bereits geladen
    if (document.getElementById('accessiblex-widget-button')) {
      return;
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        createWidgetButton();
        createWidgetIframe();
        setupToggleFunction();
      });
    } else {
      createWidgetButton();
      createWidgetIframe();
      setupToggleFunction();
    }
  }

  init();
})();
