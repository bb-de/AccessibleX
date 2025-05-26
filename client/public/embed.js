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

  // Widget Button erstellen (mit unserem schönen Design)
  function createWidgetButton() {
    const button = document.createElement('button');
    button.id = 'accessiblex-widget-button';
    button.setAttribute('aria-label', 'Barrierefreiheits-Menü öffnen');
    button.style.cssText = `
      position: fixed;
      z-index: 999999;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      background: transparent;
      padding: 0;
      ${getPositionStyles(config.position)}
    `;
    
    // Unser schönes Widget-Button-Logo verwenden
    const img = document.createElement('img');
    img.src = 'https://accessiblex.netlify.app/widget-button-logo.png';
    img.alt = 'Accessibility';
    img.style.cssText = `
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    `;
    
    button.appendChild(img);
    
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    });
    
    document.body.appendChild(button);
    return button;
  }

  // Widget iframe erstellen (nur das Panel)
  function createWidgetIframe() {
    const iframe = document.createElement('iframe');
    iframe.id = 'accessiblex-widget-iframe';
    iframe.src = `https://accessiblex.netlify.app/?embed=true&hideButton=true&position=${config.position}&color=${encodeURIComponent(config.color)}&language=${config.language}`;
    iframe.style.cssText = `
      position: fixed;
      z-index: 999998;
      width: 380px;
      height: 600px;
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
      
      // Barrierefreiheits-Einstellungen auf Host-Website anwenden
      if (event.data.type === 'accessibility-settings-change') {
        applyAccessibilityToHost(event.data.settings);
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

  // Barrierefreiheits-Einstellungen auf Host-Website anwenden
  function applyAccessibilityToHost(settings) {
    // Vorhandene Styles entfernen
    const existingStyle = document.getElementById('accessiblex-host-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Neue Styles erstellen
    let css = '';
    
    // Text-Größe
    if (settings.textSize && settings.textSize > 0) {
      const scale = 1 + (settings.textSize * 0.2);
      css += `* { font-size: ${scale}em !important; }`;
    }
    
    // Kontrast-Modus
    if (settings.contrastMode === 'high') {
      css += `
        * { 
          background-color: black !important; 
          color: white !important; 
          border-color: white !important;
        }
        a { color: yellow !important; }
      `;
    } else if (settings.contrastMode === 'inverted') {
      css += `html { filter: invert(1) !important; }`;
    }
    
    // Dunkler Modus
    if (settings.darkMode) {
      css += `
        body, html { 
          background-color: #1a1a1a !important; 
          color: #ffffff !important; 
        }
        * { 
          background-color: #2a2a2a !important; 
          color: #ffffff !important; 
        }
      `;
    }
    
    // Links hervorheben
    if (settings.highlightLinks) {
      css += `
        a { 
          background-color: yellow !important; 
          color: black !important; 
          text-decoration: underline !important;
          font-weight: bold !important;
        }
      `;
    }
    
    // Überschriften hervorheben
    if (settings.highlightTitles) {
      css += `
        h1, h2, h3, h4, h5, h6 { 
          background-color: #ffeb3b !important; 
          color: #000 !important; 
          padding: 4px !important;
          border-left: 4px solid #ff9800 !important;
        }
      `;
    }
    
    // Schriftart
    if (settings.fontFamily === 'readable') {
      css += `* { font-family: Arial, sans-serif !important; }`;
    } else if (settings.fontFamily === 'dyslexic') {
      css += `* { font-family: 'OpenDyslexic', Arial, sans-serif !important; }`;
    }
    
    // Zeilenabstand
    if (settings.lineHeight && settings.lineHeight > 0) {
      const lineHeight = 1 + (settings.lineHeight * 0.3);
      css += `* { line-height: ${lineHeight} !important; }`;
    }
    
    // Buchstabenabstand
    if (settings.letterSpacing && settings.letterSpacing > 0) {
      const spacing = settings.letterSpacing * 2;
      css += `* { letter-spacing: ${spacing}px !important; }`;
    }
    
    // Styles anwenden
    if (css) {
      const style = document.createElement('style');
      style.id = 'accessiblex-host-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  init();
})();
