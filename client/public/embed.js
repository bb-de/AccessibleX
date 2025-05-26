/**
 * Standalone Accessibility Widget
 * Vollständig eigenständiges Widget ohne externe API-Abhängigkeiten
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

  // Übersetzungen für Deutsch und Englisch
  const translations = {
    de: {
      openMenu: 'Barrierefreiheits-Menü öffnen',
      closeMenu: 'Menü schließen',
      profiles: 'Profile',
      content: 'Inhalt',
      reset: 'Zurücksetzen',
      textSize: 'Textgröße',
      lineHeight: 'Zeilenabstand',
      letterSpacing: 'Buchstabenabstand',
      darkMode: 'Dunkler Modus',
      highlightLinks: 'Links hervorheben',
      stopAnimations: 'Animationen stoppen',
      hideImages: 'Bilder ausblenden',
      vision: 'Sehbehinderung',
      cognitive: 'Kognitiv',
      motor: 'Motorisch',
      adhd: 'ADHD',
      dyslexia: 'Legasthenie',
      senior: 'Senioren'
    },
    en: {
      openMenu: 'Open accessibility menu',
      closeMenu: 'Close menu',
      profiles: 'Profiles',
      content: 'Content',
      reset: 'Reset',
      textSize: 'Text Size',
      lineHeight: 'Line Height',
      letterSpacing: 'Letter Spacing',
      darkMode: 'Dark Mode',
      highlightLinks: 'Highlight Links',
      stopAnimations: 'Stop Animations',
      hideImages: 'Hide Images',
      vision: 'Vision',
      cognitive: 'Cognitive',
      motor: 'Motor',
      adhd: 'ADHD',
      dyslexia: 'Dyslexia',
      senior: 'Senior'
    }
  };

  // Aktuelle Einstellungen
  let currentSettings = {
    textSize: 0,
    lineHeight: 0,
    letterSpacing: 0,
    darkMode: false,
    contrastMode: 'default',
    fontFamily: 'default',
    textAlign: 'default',
    highlightLinks: false,
    highlightFocus: false,
    stopAnimations: false,
    hideImages: false,
    keyboardNavigation: false
  };

  // Widget-Styles (CSS im JavaScript eingebettet)
  function createWidgetStyles() {
    const style = document.createElement('style');
    style.id = 'accessibility-widget-styles';
    style.textContent = `
      #accessibility-widget-container {
        position: fixed;
        z-index: 999999;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      
      #accessibility-widget-button {
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
      }
      
      #accessibility-widget-button:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
      }
      
      #accessibility-widget-panel {
        position: fixed;
        width: 300px;
        height: 400px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: scale(0.8) translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
        overflow: hidden;
      }
      
      #accessibility-widget-panel.open {
        transform: scale(1) translateY(0);
        opacity: 1;
        pointer-events: auto;
      }
      
      .widget-header {
        background: ${config.color};
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .widget-tabs {
        display: flex;
        border-bottom: 1px solid #eee;
      }
      
      .widget-tab {
        flex: 1;
        padding: 12px 8px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 12px;
        color: #666;
      }
      
      .widget-tab.active {
        background: ${config.color};
        color: white;
      }
      
      .widget-profiles {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 16px;
      }
      
      .widget-profile {
        padding: 12px;
        border: 2px solid #eee;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        transition: all 0.2s ease;
      }
      
      .widget-profile:hover {
        border-color: ${config.color};
        background: #f8f9fa;
      }
      
      .widget-setting {
        margin-bottom: 16px;
      }
      
      .widget-slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: #ddd;
        outline: none;
        appearance: none;
      }
      
      .widget-checkbox input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: ${config.color};
      }
      
      /* Positionierung */
      .widget-bottom-right { bottom: 20px; right: 20px; }
      .widget-bottom-left { bottom: 20px; left: 20px; }
      .widget-top-right { top: 20px; right: 20px; }
      .widget-top-left { top: 20px; left: 20px; }
      
      .panel-bottom-right { bottom: 80px; right: 20px; }
      .panel-bottom-left { bottom: 80px; left: 20px; }
      .panel-top-right { top: 80px; right: 20px; }
      .panel-top-left { top: 80px; left: 20px; }
    `;
    document.head.appendChild(style);
  }

  // Widget HTML erstellen
  function createWidget() {
    const t = translations[config.language] || translations.de;
    
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    container.className = 'widget-' + config.position;
    
    container.innerHTML = `
      <button id="accessibility-widget-button" aria-label="${t.openMenu}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5l-4.24-4.24M7.76 16.24l-4.24 4.24m0-11.31l4.24 4.24m8.48 8.48l4.24-4.24"></path>
        </svg>
      </button>
      
      <div id="accessibility-widget-panel" class="panel-${config.position}">
        <div class="widget-header">
          <h3 style="margin: 0; font-size: 16px;">Barrierefreiheit</h3>
          <button class="widget-close" id="widget-close">&times;</button>
        </div>
        
        <div class="widget-tabs">
          <button class="widget-tab active" data-tab="profiles">${t.profiles}</button>
          <button class="widget-tab" data-tab="content">${t.content}</button>
        </div>
        
        <div class="widget-content" style="padding: 16px; height: 280px; overflow-y: auto;">
          <div id="tab-profiles" class="tab-content">
            <div class="widget-profiles">
              <div class="widget-profile" data-profile="vision">${t.vision}</div>
              <div class="widget-profile" data-profile="cognitive">${t.cognitive}</div>
              <div class="widget-profile" data-profile="motor">${t.motor}</div>
              <div class="widget-profile" data-profile="adhd">${t.adhd}</div>
              <div class="widget-profile" data-profile="dyslexia">${t.dyslexia}</div>
              <div class="widget-profile" data-profile="senior">${t.senior}</div>
            </div>
            <button class="widget-reset" id="reset-all" style="width: 100%; padding: 10px; margin-top: 16px;">${t.reset}</button>
          </div>
          
          <div id="tab-content" class="tab-content" style="display: none;">
            <div class="widget-setting">
              <label style="display: block; margin-bottom: 8px;">${t.textSize}</label>
              <input type="range" class="widget-slider" min="0" max="5" value="0" id="textSize">
            </div>
            
            <div class="widget-setting">
              <label style="display: block; margin-bottom: 8px;">${t.lineHeight}</label>
              <input type="range" class="widget-slider" min="0" max="5" value="0" id="lineHeight">
            </div>
            
            <div class="widget-setting">
              <label style="display: block; margin-bottom: 8px;">${t.letterSpacing}</label>
              <input type="range" class="widget-slider" min="0" max="5" value="0" id="letterSpacing">
            </div>
            
            <div class="widget-setting">
              <label class="widget-checkbox" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="darkMode">
                ${t.darkMode}
              </label>
            </div>
            
            <div class="widget-setting">
              <label class="widget-checkbox" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="highlightLinks">
                ${t.highlightLinks}
              </label>
            </div>
            
            <div class="widget-setting">
              <label class="widget-checkbox" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="stopAnimations">
                ${t.stopAnimations}
              </label>
            </div>
            
            <div class="widget-setting">
              <label class="widget-checkbox" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="hideImages">
                ${t.hideImages}
              </label>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    return container;
  }

  // Barrierefreiheits-Styles anwenden
  function applyAccessibilityStyles() {
    let existingStyles = document.getElementById('accessibility-applied-styles');
    if (existingStyles) {
      existingStyles.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'accessibility-applied-styles';
    
    let css = '';
    
    // Alle Anpassungen werden hier als CSS generiert und angewendet
    if (currentSettings.textSize > 0) {
      const size = 100 + (currentSettings.textSize * 10);
      css += `body, p, div, span, a, li, input, button, textarea, select, label { font-size: ${size}% !important; }`;
    }
    
    if (currentSettings.lineHeight > 0) {
      const height = 1.5 + (currentSettings.lineHeight * 0.2);
      css += `p, div, span, li { line-height: ${height} !important; }`;
    }
    
    if (currentSettings.letterSpacing > 0) {
      const spacing = currentSettings.letterSpacing * 0.5;
      css += `body, p, div, span, a, li, input, button, textarea, select, label { letter-spacing: ${spacing}px !important; }`;
    }
    
    if (currentSettings.darkMode) {
      css += `
        html, body { background-color: #121212 !important; color: #ffffff !important; filter: invert(1) hue-rotate(180deg) !important; }
        img, video, picture, svg, canvas { filter: invert(1) hue-rotate(180deg) !important; }
        #accessibility-widget-container * { filter: invert(1) hue-rotate(180deg) !important; }
      `;
    }
    
    if (currentSettings.highlightLinks) {
      css += `a { text-decoration: underline !important; font-weight: bold !important; color: #0000EE !important; background-color: rgba(255, 255, 0, 0.3) !important; }`;
    }
    
    if (currentSettings.stopAnimations) {
      css += `*, *::before, *::after { animation: none !important; transition: none !important; }`;
    }
    
    if (currentSettings.hideImages) {
      css += `img, picture, video, canvas { opacity: 0.1 !important; }`;
    }
    
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Profile anwenden (vordefinierte Barrierefreiheits-Einstellungen)
  function applyProfile(profileName) {
    switch(profileName) {
      case 'vision':
        currentSettings.textSize = 3;
        currentSettings.highlightLinks = true;
        break;
      case 'cognitive':
        currentSettings.textSize = 2;
        currentSettings.lineHeight = 2;
        currentSettings.stopAnimations = true;
        break;
      case 'motor':
        currentSettings.textSize = 2;
        break;
      case 'adhd':
        currentSettings.stopAnimations = true;
        currentSettings.hideImages = true;
        break;
      case 'dyslexia':
        currentSettings.letterSpacing = 2;
        currentSettings.lineHeight = 2;
        break;
      case 'senior':
        currentSettings.textSize = 4;
        currentSettings.lineHeight = 3;
        currentSettings.letterSpacing = 1;
        break;
    }
    
    updateUI();
    applyAccessibilityStyles();
  }

  // UI aktualisieren
  function updateUI() {
    document.getElementById('textSize').value = currentSettings.textSize;
    document.getElementById('lineHeight').value = currentSettings.lineHeight;
    document.getElementById('letterSpacing').value = currentSettings.letterSpacing;
    document.getElementById('darkMode').checked = currentSettings.darkMode;
    document.getElementById('highlightLinks').checked = currentSettings.highlightLinks;
    document.getElementById('stopAnimations').checked = currentSettings.stopAnimations;
    document.getElementById('hideImages').checked = currentSettings.hideImages;
  }

  // Event-Listener für alle Interaktionen
  function setupEventListeners() {
    const button = document.getElementById('accessibility-widget-button');
    const panel = document.getElementById('accessibility-widget-panel');
    const closeBtn = document.getElementById('widget-close');
    const resetBtn = document.getElementById('reset-all');
    
    let isOpen = false;
    
    function togglePanel() {
      isOpen = !isOpen;
      panel.classList.toggle('open', isOpen);
    }
    
    button.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', togglePanel);
    
    // Tab-Wechsel
    document.querySelectorAll('.widget-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        const targetTab = this.dataset.tab;
        
        document.querySelectorAll('.widget-tab').forEach(function(t) {
          t.classList.remove('active');
        });
        this.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(function(content) {
          content.style.display = 'none';
        });
        document.getElementById('tab-' + targetTab).style.display = 'block';
      });
    });
    
    // Profil-Anwendung
    document.querySelectorAll('.widget-profile').forEach(function(profile) {
      profile.addEventListener('click', function() {
        applyProfile(this.dataset.profile);
      });
    });
    
    // Einstellungs-Listener
    document.getElementById('textSize').addEventListener('input', function() {
      currentSettings.textSize = parseInt(this.value);
      applyAccessibilityStyles();
    });
    
    document.getElementById('lineHeight').addEventListener('input', function() {
      currentSettings.lineHeight = parseInt(this.value);
      applyAccessibilityStyles();
    });
    
    document.getElementById('letterSpacing').addEventListener('input', function() {
      currentSettings.letterSpacing = parseInt(this.value);
      applyAccessibilityStyles();
    });
    
    document.getElementById('darkMode').addEventListener('change', function() {
      currentSettings.darkMode = this.checked;
      applyAccessibilityStyles();
    });
    
    document.getElementById('highlightLinks').addEventListener('change', function() {
      currentSettings.highlightLinks = this.checked;
      applyAccessibilityStyles();
    });
    
    document.getElementById('stopAnimations').addEventListener('change', function() {
      currentSettings.stopAnimations = this.checked;
      applyAccessibilityStyles();
    });
    
    document.getElementById('hideImages').addEventListener('change', function() {
      currentSettings.hideImages = this.checked;
      applyAccessibilityStyles();
    });
    
    // Reset-Funktion
    resetBtn.addEventListener('click', function() {
      currentSettings = {
        textSize: 0, lineHeight: 0, letterSpacing: 0, darkMode: false,
        contrastMode: 'default', fontFamily: 'default', textAlign: 'default',
        highlightLinks: false, highlightFocus: false, stopAnimations: false,
        hideImages: false, keyboardNavigation: false
      };
      
      updateUI();
      applyAccessibilityStyles();
    });
  }

  // Initialisierung
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        createWidgetStyles();
        createWidget();
        setupEventListeners();
      });
    } else {
      createWidgetStyles();
      createWidget();
      setupEventListeners();
    }
  }

  init();
})();
