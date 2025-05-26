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

  // Übersetzungen
  const translations = {
    de: {
      openMenu: 'Barrierefreiheits-Menü öffnen',
      closeMenu: 'Menü schließen',
      profiles: 'Profile',
      content: 'Inhalt',
      navigation: 'Navigation',
      reset: 'Zurücksetzen',
      textSize: 'Textgröße',
      lineHeight: 'Zeilenabstand',
      letterSpacing: 'Buchstabenabstand',
      darkMode: 'Dunkler Modus',
      highContrast: 'Hoher Kontrast',
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
      navigation: 'Navigation',
      reset: 'Reset',
      textSize: 'Text Size',
      lineHeight: 'Line Height',
      letterSpacing: 'Letter Spacing',
      darkMode: 'Dark Mode',
      highContrast: 'High Contrast',
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

  // Widget-Styles
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
        position: relative;
      }
      
      #accessibility-widget-button:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
      }
      
      #accessibility-widget-button svg {
        width: 28px;
        height: 28px;
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
      
      .widget-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
      }
      
      .widget-close:hover {
        background: rgba(255, 255, 255, 0.2);
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
        transition: all 0.2s ease;
      }
      
      .widget-tab.active {
        background: ${config.color};
        color: white;
      }
      
      .widget-content {
        padding: 16px;
        height: 280px;
        overflow-y: auto;
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
      
      .widget-setting label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        color: #333;
      }
      
      .widget-slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: #ddd;
        outline: none;
        appearance: none;
      }
      
      .widget-slider::-webkit-slider-thumb {
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${config.color};
        cursor: pointer;
      }
      
      .widget-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
      
      .widget-checkbox input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: ${config.color};
      }
      
      .widget-reset {
        width: 100%;
        padding: 10px;
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 16px;
      }
      
      .widget-reset:hover {
        background: #e9ecef;
      }
      
      /* Position variants */
      .widget-bottom-right {
        bottom: 20px;
        right: 20px;
      }
      
      .widget-bottom-left {
        bottom: 20px;
        left: 20px;
      }
      
      .widget-top-right {
        top: 20px;
        right: 20px;
      }
      
      .widget-top-left {
        top: 20px;
        left: 20px;
      }
      
      .panel-bottom-right {
        bottom: 80px;
        right: 20px;
      }
      
      .panel-bottom-left {
        bottom: 80px;
        left: 20px;
      }
      
      .panel-top-right {
        top: 80px;
        right: 20px;
      }
      
      .panel-top-left {
        top: 80px;
        left: 20px;
      }
    `;
    document.head.appendChild(style);
  }

  // Widget HTML erstellen
  function createWidget() {
    const t = translations[config.language] || translations.de;
    
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    container.className = 'widget-' + config.position;
    
    // Button erstellen
    const button = document.createElement('button');
    button.id = 'accessibility-widget-button';
    button.setAttribute('aria-label', t.openMenu);
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5l-4.24-4.24M7.76 16.24l-4.24 4.24m0-11.31l4.24 4.24m8.48 8.48l4.24-4.24"></path>
      </svg>
    `;
    
    // Panel erstellen
    const panel = document.createElement('div');
    panel.id = 'accessibility-widget-panel';
    panel.className = 'panel-' + config.position;
    
    // Header
    const header = document.createElement('div');
    header.className = 'widget-header';
    header.innerHTML = `
      <h3 style="margin: 0; font-size: 16px;">Barrierefreiheit</h3>
      <button class="widget-close" id="widget-close">&times;</button>
    `;
    
    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'widget-tabs';
    tabs.innerHTML = `
      <button class="widget-tab active" data-tab="profiles">${t.profiles}</button>
      <button class="widget-tab" data-tab="content">${t.content}</button>
    `;
    
    // Content Container
    const content = document.createElement('div');
    content.className = 'widget-content';
    content.style.cssText = 'padding: 16px; height: 280px; overflow-y: auto;';
    
    // Profiles Tab
    const profilesTab = document.createElement('div');
    profilesTab.id = 'tab-profiles';
    profilesTab.className = 'tab-content';
    
    const profilesGrid = document.createElement('div');
    profilesGrid.className = 'widget-profiles';
    
    // Profile Items einzeln erstellen
    const profiles = [
      { id: 'vision', icon: '👁️', text: 'Sehbehinderung' },
      { id: 'cognitive', icon: '🧠', text: 'Kognitiv' },
      { id: 'motor', icon: '✋', text: 'Motorisch' },
      { id: 'adhd', icon: '⚡', text: 'ADHD' },
      { id: 'dyslexia', icon: '📖', text: 'Legasthenie' },
      { id: 'senior', icon: '👴', text: 'Senioren' }
    ];
    
    profiles.forEach(function(profile) {
      const profileDiv = document.createElement('div');
      profileDiv.className = 'widget-profile';
      profileDiv.setAttribute('data-profile', profile.id);
      profileDiv.innerHTML = profile.icon + '<br>' + profile.text;
      profilesGrid.appendChild(profileDiv);
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'widget-reset';
    resetBtn.id = 'reset-all';
    resetBtn.textContent = t.reset;
    resetBtn.style.cssText = 'width: 100%; padding: 10px; margin-top: 16px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;';
    
    profilesTab.appendChild(profilesGrid);
    profilesTab.appendChild(resetBtn);
    
    // Content Tab
    const contentTab = document.createElement('div');
    contentTab.id = 'tab-content';
    contentTab.className = 'tab-content';
    contentTab.style.display = 'none';
    
    // Settings einzeln erstellen
    const settings = [
      { id: 'textSize', label: t.textSize, type: 'range' },
      { id: 'lineHeight', label: t.lineHeight, type: 'range' },
      { id: 'letterSpacing', label: t.letterSpacing, type: 'range' },
      { id: 'darkMode', label: t.darkMode, type: 'checkbox' },
      { id: 'highlightLinks', label: t.highlightLinks, type: 'checkbox' },
      { id: 'stopAnimations', label: t.stopAnimations, type: 'checkbox' },
      { id: 'hideImages', label: t.hideImages, type: 'checkbox' }
    ];
    
    settings.forEach(function(setting) {
      const settingDiv = document.createElement('div');
      settingDiv.className = 'widget-setting';
      settingDiv.style.marginBottom = '16px';
      
      if (setting.type === 'range') {
        const label = document.createElement('label');
        label.textContent = setting.label;
        label.style.cssText = 'display: block; margin-bottom: 8px; font-weight: 500;';
        
        const input = document.createElement('input');
        input.type = 'range';
        input.className = 'widget-slider';
        input.min = '0';
        input.max = '5';
        input.value = '0';
        input.id = setting.id;
        
        settingDiv.appendChild(label);
        settingDiv.appendChild(input);
      } else {
        const label = document.createElement('label');
        label.className = 'widget-checkbox';
        label.style.cssText = 'display: flex; align-items: center; gap: 8px; cursor: pointer;';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = setting.id;
        input.style.cssText = 'width: 18px; height: 18px; accent-color: ' + config.color + ';';
        
        const span = document.createElement('span');
        span.textContent = setting.label;
        
        label.appendChild(input);
        label.appendChild(span);
        settingDiv.appendChild(label);
      }
      
      contentTab.appendChild(settingDiv);
    });
    
    // Alles zusammenfügen
    content.appendChild(profilesTab);
    content.appendChild(contentTab);
    
    panel.appendChild(header);
    panel.appendChild(tabs);
    panel.appendChild(content);
    
    container.appendChild(button);
    container.appendChild(panel);
    
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
    
    // Textgröße
    if (currentSettings.textSize > 0) {
      const size = 100 + (currentSettings.textSize * 10);
      css += `
        body, p, div, span, a, li, input, button, textarea, select, label {
          font-size: ${size}% !important;
        }
      `;
    }
    
    // Zeilenabstand
    if (currentSettings.lineHeight > 0) {
      const height = 1.5 + (currentSettings.lineHeight * 0.2);
      css += `
        p, div, span, li {
          line-height: ${height} !important;
        }
      `;
    }
    
    // Buchstabenabstand
    if (currentSettings.letterSpacing > 0) {
      const spacing = currentSettings.letterSpacing * 0.5;
      css += `
        body, p, div, span, a, li, input, button, textarea, select, label {
          letter-spacing: ${spacing}px !important;
        }
      `;
    }
    
    // Dunkler Modus
    if (currentSettings.darkMode) {
      css += `
        html, body {
          background-color: #121212 !important;
          color: #ffffff !important;
          filter: invert(1) hue-rotate(180deg) !important;
        }
        
        img, video, picture, svg, canvas {
          filter: invert(1) hue-rotate(180deg) !important;
        }
        
        #accessibility-widget-container * {
          filter: invert(1) hue-rotate(180deg) !important;
        }
      `;
    }
    
    // Links hervorheben
    if (currentSettings.highlightLinks) {
      css += `
        a {
          text-decoration: underline !important;
          font-weight: bold !important;
          color: #0000EE !important;
          background-color: rgba(255, 255, 0, 0.3) !important;
        }
      `;
    }
    
    // Animationen stoppen
    if (currentSettings.stopAnimations) {
      css += `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `;
    }
    
    // Bilder ausblenden
    if (currentSettings.hideImages) {
      css += `
        img, picture, video, canvas {
          opacity: 0.1 !important;
        }
      `;
    }
    
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Profile anwenden
  function applyProfile(profileName) {
    switch(profileName) {
      case 'vision':
        currentSettings.textSize = 3;
        currentSettings.contrastMode = 'high';
        currentSettings.highlightLinks = true;
        break;
      case 'cognitive':
        currentSettings.textSize = 2;
        currentSettings.lineHeight = 2;
        currentSettings.stopAnimations = true;
        break;
      case 'motor':
        currentSettings.textSize = 2;
        currentSettings.highlightFocus = true;
        break;
      case 'adhd':
        currentSettings.stopAnimations = true;
        currentSettings.hideImages = true;
        break;
      case 'dyslexia':
        currentSettings.fontFamily = 'dyslexic';
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

  // Event-Listener
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
    
    // Tabs
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
    
    // Profile
    document.querySelectorAll('.widget-profile').forEach(function(profile) {
      profile.addEventListener('click', function() {
        applyProfile(this.dataset.profile);
      });
    });
    
    // Einstellungen
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
    
    // Reset
    resetBtn.addEventListener('click', function() {
      currentSettings = {
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
