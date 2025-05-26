/**
 * AccessibleX Direct Embed Script
 * Lädt das komplette Widget direkt in die Website ohne iframe
 */

(function() {
  'use strict';
  
  // Prevent multiple instances
  if (window.AccessibleXWidget) {
    return;
  }
  
  // Mark as loaded
  window.AccessibleXWidget = true;
  
  // Configuration
  const DEFAULT_CONFIG = {
    position: 'bottom-right',
    language: 'de',
    color: '#0055A4',
    widgetLogo: '',
    tokenId: ''
  };

  // Load config from script tag
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  
  const config = Object.assign({}, DEFAULT_CONFIG);
  for (const key in DEFAULT_CONFIG) {
    if (currentScript.dataset[key]) {
      config[key] = currentScript.dataset[key];
    }
  }

  // Widget state
  let isOpen = false;
  let settings = {
    textSize: 0,
    lineHeight: 0,
    letterSpacing: 0,
    contrastMode: 'default',
    darkMode: false,
    monochromeFilter: false,
    colorSaturation: 0,
    highlightLinks: false,
    highlightTitles: false,
    stopAnimations: false,
    hideImages: false,
    readingMask: false,
    readingGuide: false,
    fontFamily: 'default',
    wordSpacing: 0,
    textAlign: 'default',
    keyboardNavigation: false,
    highlightFocus: false,
    customCursor: false,
    cursorSize: 'default',
    cursorColor: 'black',
    virtualKeyboard: false,
    pageStructure: false,
  };

  // Translations
  const translations = {
    en: {
      accessibilityWidget: 'Accessible',
      reset: 'Reset',
      close: 'Close',
      visionImpaired: 'Vision Impaired',
      cognitiveDisability: 'Cognitive Disability',
      senior: 'Senior',
      motorImpaired: 'Motor Impaired',
      adhdFriendly: 'ADHD Friendly',
      dyslexiaFriendly: 'Dyslexia Friendly',
      textSize: 'Text Size',
      contrastMode: 'Contrast Mode',
      darkMode: 'Dark Mode',
      highlightLinks: 'Highlight Links',
      highlightTitles: 'Highlight Titles',
    },
    de: {
      accessibilityWidget: 'Accessible',
      reset: 'Zurücksetzen',
      close: 'Schließen',
      visionImpaired: 'Sehbehindert',
      cognitiveDisability: 'Kognitive Behinderung',
      senior: 'Senior',
      motorImpaired: 'Motorisch beeinträchtigt',
      adhdFriendly: 'ADHS-freundlich',
      dyslexiaFriendly: 'Legasthenie-freundlich',
      textSize: 'Textgröße',
      contrastMode: 'Kontrast-Modus',
      darkMode: 'Dunkler Modus',
      highlightLinks: 'Links hervorheben',
      highlightTitles: 'Titel hervorheben',
    }
  };

  const t = translations[config.language] || translations.de;

  // Create widget button
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
      background: linear-gradient(135deg, #0055A4 0%, #0066CC 100%);
      padding: 0;
      ${getPositionStyles(config.position)}
    `;
    
    // Accessibility icon
    button.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 5.5 14.6 5.4 14.5 5.3L13 4.4C12.6 4.1 12.1 4.1 11.7 4.4L10.2 5.3C10 5.4 9.8 5.5 9.6 5.5L3 7V9L9.5 7.5C9.7 7.5 9.9 7.4 10.1 7.3L12 6.1L13.9 7.3C14.1 7.4 14.3 7.5 14.5 7.5L21 9ZM7 12.5C7.8 12.5 8.5 11.8 8.5 11S7.8 9.5 7 9.5 5.5 10.2 5.5 11 6.2 12.5 7 12.5ZM17 12.5C17.8 12.5 18.5 11.8 18.5 11S17.8 9.5 17 9.5 15.5 10.2 15.5 11 16.2 12.5 17 12.5ZM7 22V16C7 15.4 7.4 15 8 15S9 15.4 9 16V22H11V16C11 14.3 9.7 13 8 13S5 14.3 5 16V22H7ZM19 22V16C19 15.4 18.6 15 18 15S17 15.4 17 16V22H15V16C15 14.3 16.3 13 18 13S21 14.3 21 16V22H19Z"/>
      </svg>
    `;
    
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    });
    
    button.addEventListener('click', toggleWidget);
    
    document.body.appendChild(button);
    return button;
  }

  // Create widget panel
  function createWidgetPanel() {
    const panel = document.createElement('div');
    panel.id = 'accessiblex-widget-panel';
    panel.style.cssText = `
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #333;
      overflow: hidden;
      ${getPanelPositionStyles(config.position)}
    `;
    
    panel.innerHTML = createPanelHTML();
    document.body.appendChild(panel);
    setupPanelEvents(panel);
    return panel;
  }

  // Create panel HTML
  function createPanelHTML() {
    return `
      <div style="height: 100%; display: flex; flex-direction: column;">
        <!-- Header -->
        <div style="padding: 20px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #0055A4 0%, #0066CC 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 5.5 14.6 5.4 14.5 5.3L13 4.4C12.6 4.1 12.1 4.1 11.7 4.4L10.2 5.3C10 5.4 9.8 5.5 9.6 5.5L3 7V9L9.5 7.5C9.7 7.5 9.9 7.4 10.1 7.3L12 6.1L13.9 7.3C14.1 7.4 14.3 7.5 14.5 7.5L21 9ZM7 12.5C7.8 12.5 8.5 11.8 8.5 11S7.8 9.5 7 9.5 5.5 10.2 5.5 11 6.2 12.5 7 12.5ZM17 12.5C17.8 12.5 18.5 11.8 18.5 11S17.8 9.5 17 9.5 15.5 10.2 15.5 11 16.2 12.5 17 12.5ZM7 22V16C7 15.4 7.4 15 8 15S9 15.4 9 16V22H11V16C11 14.3 9.7 13 8 13S5 14.3 5 16V22H7ZM19 22V16C19 15.4 18.6 15 18 15S17 15.4 17 16V22H15V16C15 14.3 16.3 13 18 13S21 14.3 21 16V22H19Z"/>
              </svg>
            </div>
            <span style="font-weight: 600; font-size: 18px;">${t.accessibilityWidget}</span>
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="reset-btn" style="background: none; border: 1px solid #ddd; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px;">${t.reset}</button>
            <button id="close-btn" style="background: none; border: none; cursor: pointer; font-size: 18px; padding: 4px;">×</button>
          </div>
        </div>
        
        <!-- Content -->
        <div style="flex: 1; overflow-y: auto; padding: 20px;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase;">BARRIEREFREIHEITS-PROFILE</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <button class="profile-btn" data-profile="visionImpaired" style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; text-align: center; transition: all 0.2s;">
                <div style="font-size: 24px; margin-bottom: 8px;">👁️</div>
                <div style="font-size: 12px; font-weight: 500;">${t.visionImpaired}</div>
              </button>
              <button class="profile-btn" data-profile="cognitiveDisability" style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; text-align: center; transition: all 0.2s;">
                <div style="font-size: 24px; margin-bottom: 8px;">🧠</div>
                <div style="font-size: 12px; font-weight: 500;">${t.cognitiveDisability}</div>
              </button>
              <button class="profile-btn" data-profile="senior" style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; text-align: center; transition: all 0.2s;">
                <div style="font-size: 24px; margin-bottom: 8px;">👴</div>
                <div style="font-size: 12px; font-weight: 500;">${t.senior}</div>
              </button>
              <button class="profile-btn" data-profile="motorImpaired" style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; text-align: center; transition: all 0.2s;">
                <div style="font-size: 24px; margin-bottom: 8px;">✋</div>
                <div style="font-size: 12px; font-weight: 500;">${t.motorImpaired}</div>
              </button>
              <button class="profile-btn" data-profile="adhdFriendly" style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; text-align: center; transition: all 0.2s;">
                <div style="font-size: 24px; margin-bottom: 8px;">⚡</div>
                <div style="font-size: 12px; font-weight: 500;">${t.adhdFriendly}</div>
              </button>
              <button class="profile-btn" data-profile="dyslexiaFriendly" style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; text-align: center; transition: all 0.2s;">
                <div style="font-size: 24px; margin-bottom: 8px;">📖</div>
                <div style="font-size: 12px; font-weight: 500;">${t.dyslexiaFriendly}</div>
              </button>
            </div>
          </div>
          
          <div>
            <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase;">SCHNELLE ANPASSUNGEN</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px;">${t.textSize}</span>
                <div style="display: flex; gap: 5px;">
                  <button class="text-size-btn" data-action="decrease" style="width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">-</button>
                  <span id="text-size-value" style="width: 32px; text-align: center; line-height: 32px; font-size: 14px;">0</span>
                  <button class="text-size-btn" data-action="increase" style="width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">+</button>
                </div>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px;">${t.contrastMode}</span>
                <select id="contrast-select" style="padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: white;">
                  <option value="default">Standard</option>
                  <option value="increased">Erhöht</option>
                  <option value="high">Hoch</option>
                  <option value="inverted">Invertiert</option>
                </select>
              </div>
              
              <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span style="font-size: 14px;">${t.darkMode}</span>
                <input type="checkbox" id="dark-mode-toggle" style="width: 18px; height: 18px;">
              </label>
              
              <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span style="font-size: 14px;">${t.highlightLinks}</span>
                <input type="checkbox" id="highlight-links-toggle" style="width: 18px; height: 18px;">
              </label>
              
              <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span style="font-size: 14px;">${t.highlightTitles}</span>
                <input type="checkbox" id="highlight-titles-toggle" style="width: 18px; height: 18px;">
              </label>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Setup panel events
  function setupPanelEvents(panel) {
    // Close button
    panel.querySelector('#close-btn').addEventListener('click', toggleWidget);
    
    // Reset button
    panel.querySelector('#reset-btn').addEventListener('click', resetSettings);
    
    // Profile buttons
    panel.querySelectorAll('.profile-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const profile = this.dataset.profile;
        applyProfile(profile);
        
        // Visual feedback
        panel.querySelectorAll('.profile-btn').forEach(b => b.style.background = 'white');
        this.style.background = '#e3f2fd';
      });
      
      btn.addEventListener('mouseenter', function() {
        if (this.style.background !== '#e3f2fd') {
          this.style.background = '#f5f5f5';
        }
      });
      
      btn.addEventListener('mouseleave', function() {
        if (this.style.background !== '#e3f2fd') {
          this.style.background = 'white';
        }
      });
    });
    
    // Text size buttons
    panel.querySelectorAll('.text-size-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.dataset.action;
        if (action === 'increase' && settings.textSize < 5) {
          settings.textSize++;
        } else if (action === 'decrease' && settings.textSize > -5) {
          settings.textSize--;
        }
        updateTextSizeDisplay();
        applyAccessibilityChanges();
      });
    });
    
    // Contrast select
    panel.querySelector('#contrast-select').addEventListener('change', function() {
      settings.contrastMode = this.value;
      applyAccessibilityChanges();
    });
    
    // Dark mode toggle
    panel.querySelector('#dark-mode-toggle').addEventListener('change', function() {
      settings.darkMode = this.checked;
      applyAccessibilityChanges();
    });
    
    // Highlight links toggle
    panel.querySelector('#highlight-links-toggle').addEventListener('change', function() {
      settings.highlightLinks = this.checked;
      applyAccessibilityChanges();
    });
    
    // Highlight titles toggle
    panel.querySelector('#highlight-titles-toggle').addEventListener('change', function() {
      settings.highlightTitles = this.checked;
      applyAccessibilityChanges();
    });
  }

  // Position styles
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

  function getPanelPositionStyles(position) {
    switch(position) {
      case 'bottom-right':
        return 'bottom: 90px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 90px; left: 20px;';
      case 'top-right':
        return 'top: 90px; right: 20px;';
      case 'top-left':
        return 'top: 90px; left: 20px;';
      default:
        return 'bottom: 90px; right: 20px;';
    }
  }

  // Toggle widget
  function toggleWidget() {
    const button = document.getElementById('accessiblex-widget-button');
    const panel = document.getElementById('accessiblex-widget-panel');
    
    isOpen = !isOpen;
    
    if (isOpen) {
      panel.style.opacity = '1';
      panel.style.transform = 'scale(1) translateY(0)';
      panel.style.pointerEvents = 'auto';
      button.setAttribute('aria-expanded', 'true');
    } else {
      panel.style.opacity = '0';
      panel.style.transform = 'scale(0.8) translateY(20px)';
      panel.style.pointerEvents = 'none';
      button.setAttribute('aria-expanded', 'false');
    }
  }

  // Apply profile
  function applyProfile(profileId) {
    // Reset first
    settings = {
      textSize: 0,
      lineHeight: 0,
      letterSpacing: 0,
      contrastMode: 'default',
      darkMode: false,
      monochromeFilter: false,
      colorSaturation: 0,
      highlightLinks: false,
      highlightTitles: false,
      stopAnimations: false,
      hideImages: false,
      readingMask: false,
      readingGuide: false,
      fontFamily: 'default',
      wordSpacing: 0,
      textAlign: 'default',
      keyboardNavigation: false,
      highlightFocus: false,
      customCursor: false,
      cursorSize: 'default',
      cursorColor: 'black',
      virtualKeyboard: false,
      pageStructure: false,
    };
    
    // Apply profile-specific settings
    switch (profileId) {
      case 'visionImpaired':
        settings.textSize = 2;
        settings.contrastMode = 'increased';
        settings.fontFamily = 'readable';
        break;
      case 'cognitiveDisability':
        settings.fontFamily = 'readable';
        settings.lineHeight = 2;
        settings.highlightTitles = true;
        break;
      case 'senior':
        settings.textSize = 2;
        settings.contrastMode = 'increased';
        settings.fontFamily = 'readable';
        settings.highlightLinks = true;
        break;
      case 'motorImpaired':
        settings.keyboardNavigation = true;
        settings.highlightFocus = true;
        settings.customCursor = true;
        break;
      case 'adhdFriendly':
        settings.readingMask = true;
        settings.stopAnimations = true;
        settings.highlightFocus = true;
        break;
      case 'dyslexiaFriendly':
        settings.fontFamily = 'dyslexic';
        settings.lineHeight = 1;
        settings.letterSpacing = 2;
        settings.readingGuide = true;
        break;
    }
    
    updateUI();
    applyAccessibilityChanges();
  }

  // Reset settings
  function resetSettings() {
    settings = {
      textSize: 0,
      lineHeight: 0,
      letterSpacing: 0,
      contrastMode: 'default',
      darkMode: false,
      monochromeFilter: false,
      colorSaturation: 0,
      highlightLinks: false,
      highlightTitles: false,
      stopAnimations: false,
      hideImages: false,
      readingMask: false,
      readingGuide: false,
      fontFamily: 'default',
      wordSpacing: 0,
      textAlign: 'default',
      keyboardNavigation: false,
      highlightFocus: false,
      customCursor: false,
      cursorSize: 'default',
      cursorColor: 'black',
      virtualKeyboard: false,
      pageStructure: false,
    };
    
    updateUI();
    applyAccessibilityChanges();
  }

  // Update UI
  function updateUI() {
    const panel = document.getElementById('accessiblex-widget-panel');
    if (!panel) return;
    
    updateTextSizeDisplay();
    panel.querySelector('#contrast-select').value = settings.contrastMode;
    panel.querySelector('#dark-mode-toggle').checked = settings.darkMode;
    panel.querySelector('#highlight-links-toggle').checked = settings.highlightLinks;
    panel.querySelector('#highlight-titles-toggle').checked = settings.highlightTitles;
    
    // Reset profile buttons
    panel.querySelectorAll('.profile-btn').forEach(b => b.style.background = 'white');
  }

  // Update text size display
  function updateTextSizeDisplay() {
    const display = document.getElementById('text-size-value');
    if (display) {
      display.textContent = settings.textSize;
    }
  }

  // Apply accessibility changes
  function applyAccessibilityChanges() {
    // Remove existing styles
    const existingStyle = document.getElementById('accessiblex-host-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create new styles
    let css = '';
    
    // Text size
    if (settings.textSize !== 0) {
      const scale = 1 + (settings.textSize * 0.2);
      css += `
        body *, html * { 
          font-size: ${scale}em !important; 
        }
        #accessiblex-widget-button, #accessiblex-widget-panel, 
        #accessiblex-widget-button *, #accessiblex-widget-panel * {
          font-size: initial !important;
        }
      `;
    }
    
    // Contrast mode
    if (settings.contrastMode === 'increased') {
      css += `
        body *, html * { 
          color: #000 !important; 
          background-color: #fff !important;
        }
        a { color: #0000EE !important; }
        #accessiblex-widget-button, #accessiblex-widget-panel {
          color: initial !important;
          background-color: initial !important;
        }
      `;
    } else if (settings.contrastMode === 'high') {
      css += `
        body *, html * { 
          background-color: #000 !important; 
          color: #fff !important; 
          border-color: #fff !important;
        }
        a { color: #ff0 !important; }
        #accessiblex-widget-button, #accessiblex-widget-panel {
          background-color: initial !important;
          color: initial !important;
        }
      `;
    } else if (settings.contrastMode === 'inverted') {
      css += `
        html { filter: invert(1) !important; }
        #accessiblex-widget-button, #accessiblex-widget-panel {
          filter: invert(1) !important;
        }
      `;
    }
    
    // Dark mode
    if (settings.darkMode) {
      css += `
        body, html { 
          background-color: #1a1a1a !important; 
          color: #ffffff !important; 
        }
        body *, html * { 
          background-color: #2a2a2a !important; 
          color: #ffffff !important; 
        }
        #accessiblex-widget-button, #accessiblex-widget-panel {
          background-color: initial !important;
          color: initial !important;
        }
      `;
    }
    
    // Highlight links
    if (settings.highlightLinks) {
      css += `
        a { 
          background-color: #ff0 !important; 
          color: #000 !important; 
          text-decoration: underline !important;
          font-weight: bold !important;
        }
      `;
    }
    
    // Highlight titles
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
    
    // Font family
    if (settings.fontFamily === 'readable') {
      css += `
        body *, html * { 
          font-family: Arial, sans-serif !important; 
        }
        #accessiblex-widget-button *, #accessiblex-widget-panel * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      `;
    } else if (settings.fontFamily === 'dyslexic') {
      css += `
        body *, html * { 
          font-family: 'OpenDyslexic', Arial, sans-serif !important; 
        }
        #accessiblex-widget-button *, #accessiblex-widget-panel * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      `;
    }
    
    // Apply styles
    if (css) {
      const style = document.createElement('style');
      style.id = 'accessiblex-host-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }
    
    // Save to localStorage
    localStorage.setItem('accessiblex-settings', JSON.stringify(settings));
  }

  // Load saved settings
  function loadSavedSettings() {
    const saved = localStorage.getItem('accessiblex-settings');
    if (saved) {
      try {
        settings = { ...settings, ...JSON.parse(saved) };
        applyAccessibilityChanges();
      } catch (e) {
        console.error('Failed to load saved settings', e);
      }
    }
  }

  // Initialize
  function init() {
    // Prevent multiple instances
    if (document.getElementById('accessiblex-widget-button')) {
      return;
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        createWidgetButton();
        createWidgetPanel();
        loadSavedSettings();
        updateUI();
      });
    } else {
      createWidgetButton();
      createWidgetPanel();
      loadSavedSettings();
      updateUI();
    }
  }

  init();
})();
