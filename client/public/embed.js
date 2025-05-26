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
      profiles: 'Profiles',
      vision: 'Vision',
      content: 'Content',
      navigation: 'Navigation',
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
      profiles: 'Profile',
      vision: 'Sicht',
      content: 'Inhalt',
      navigation: 'Navigation',
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

  // Widget state for tabs
  let currentTab = 'profiles';

  // Create panel HTML with proper design
  function createPanelHTML() {
    return `
      <div style="height: 100%; display: flex; flex-direction: column; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Header -->
        <div style="padding: 20px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center; background: white;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: #1976D2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 5.5 14.6 5.4 14.5 5.3L13 4.4C12.6 4.1 12.1 4.1 11.7 4.4L10.2 5.3C10 5.4 9.8 5.5 9.6 5.5L3 7V9L9.5 7.5C9.7 7.5 9.9 7.4 10.1 7.3L12 6.1L13.9 7.3C14.1 7.4 14.3 7.5 14.5 7.5L21 9ZM7 12.5C7.8 12.5 8.5 11.8 8.5 11S7.8 9.5 7 9.5 5.5 10.2 5.5 11 6.2 12.5 7 12.5ZM17 12.5C17.8 12.5 18.5 11.8 18.5 11S17.8 9.5 17 9.5 15.5 10.2 15.5 11 16.2 12.5 17 12.5ZM7 22V16C7 15.4 7.4 15 8 15S9 15.4 9 16V22H11V16C11 14.3 9.7 13 8 13S5 14.3 5 16V22H7ZM19 22V16C19 15.4 18.6 15 18 15S17 15.4 17 16V22H15V16C15 14.3 16.3 13 18 13S21 14.3 21 16V22H19Z"/>
              </svg>
            </div>
            <span style="font-weight: 600; font-size: 20px; color: #1a1a1a;">${t.accessibilityWidget}</span>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <!-- Language dropdown -->
            <select id="language-select" style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 6px; background: white; font-size: 12px;">
              <option value="de">🇩🇪 Deutsch</option>
              <option value="en">🇺🇸 English</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="es">🇪🇸 Español</option>
            </select>
            <button id="reset-btn" style="background: none; border: 1px solid #d1d5db; border-radius: 6px; padding: 4px 8px; cursor: pointer; font-size: 12px; color: #6b7280;">↻ ${t.reset}</button>
            <button id="close-btn" style="background: none; border: none; cursor: pointer; font-size: 20px; padding: 4px; color: #9ca3af;">×</button>
          </div>
        </div>
        
        <!-- Tab Navigation -->
        <div style="display: flex; border-bottom: 1px solid #e5e5e5; background: #f9fafb;">
          <button class="tab-btn" data-tab="profiles" style="flex: 1; padding: 12px; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; border-bottom: 2px solid ${currentTab === 'profiles' ? '#1976D2' : 'transparent'}; color: ${currentTab === 'profiles' ? '#1976D2' : '#6b7280'};">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span style="font-size: 11px; font-weight: 500;">Profile</span>
          </button>
          <button class="tab-btn" data-tab="vision" style="flex: 1; padding: 12px; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; border-bottom: 2px solid ${currentTab === 'vision' ? '#1976D2' : 'transparent'}; color: ${currentTab === 'vision' ? '#1976D2' : '#6b7280'};">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <span style="font-size: 11px; font-weight: 500;">Sicht</span>
          </button>
          <button class="tab-btn" data-tab="content" style="flex: 1; padding: 12px; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; border-bottom: 2px solid ${currentTab === 'content' ? '#1976D2' : 'transparent'}; color: ${currentTab === 'content' ? '#1976D2' : '#6b7280'};">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <span style="font-size: 11px; font-weight: 500;">Inhalt</span>
          </button>
          <button class="tab-btn" data-tab="navigation" style="flex: 1; padding: 12px; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; border-bottom: 2px solid ${currentTab === 'navigation' ? '#1976D2' : 'transparent'}; color: ${currentTab === 'navigation' ? '#1976D2' : '#6b7280'};">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span style="font-size: 11px; font-weight: 500;">Navigation</span>
          </button>
        </div>
        
        <!-- Tab Content -->
        <div style="flex: 1; overflow-y: auto;">
          <!-- Profiles Tab -->
          <div id="profiles-tab" style="padding: 20px; display: ${currentTab === 'profiles' ? 'block' : 'none'};">
            <div style="margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">BARRIEREFREIHEITS-PROFILE</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button class="profile-btn" data-profile="visionImpaired" style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 32px; margin-bottom: 8px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#1976D2">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </div>
                  <div style="font-size: 12px; font-weight: 500; color: #1f2937;">${t.visionImpaired}</div>
                </button>
                <button class="profile-btn" data-profile="cognitiveDisability" style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 32px; margin-bottom: 8px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#EC407A">
                      <path d="M9 11H7v9h2v-9zm4 0h-2v9h2v-9zm4 0h-2v9h2v-9zm2.5-5H14V4.5h-4V6H5.5v2h13V6z"/>
                    </svg>
                  </div>
                  <div style="font-size: 12px; font-weight: 500; color: #1f2937;">${t.cognitiveDisability}</div>
                </button>
                <button class="profile-btn" data-profile="senior" style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 32px; margin-bottom: 8px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#FF9800">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div style="font-size: 12px; font-weight: 500; color: #1f2937;">${t.senior}</div>
                </button>
                <button class="profile-btn" data-profile="motorImpaired" style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 32px; margin-bottom: 8px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#42A5F5">
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                    </svg>
                  </div>
                  <div style="font-size: 12px; font-weight: 500; color: #1f2937;">${t.motorImpaired}</div>
                </button>
                <button class="profile-btn" data-profile="adhdFriendly" style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 32px; margin-bottom: 8px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#66BB6A">
                      <path d="M7 14H5v5h2v-5zm3-7H8v12h2V7zm3 3h-2v9h2v-9zm3-6h-2v15h2V4z"/>
                    </svg>
                  </div>
                  <div style="font-size: 12px; font-weight: 500; color: #1f2937;">${t.adhdFriendly}</div>
                </button>
                <button class="profile-btn" data-profile="dyslexiaFriendly" style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 32px; margin-bottom: 8px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#5C6BC0">
                      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                    </svg>
                  </div>
                  <div style="font-size: 12px; font-weight: 500; color: #1f2937;">${t.dyslexiaFriendly}</div>
                </button>
              </div>
            </div>
            
            <!-- Quick settings in profiles tab -->
            <div>
              <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">SCHNELLE ANPASSUNGEN</h3>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 14px; color: #1f2937; font-weight: 500;">${t.textSize}</span>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="text-size-btn" data-action="decrease" style="width: 32px; height: 32px; border: 1px solid #d1d5db; border-radius: 6px; background: white; cursor: pointer; font-weight: bold; color: #6b7280;">−</button>
                    <span id="text-size-value" style="min-width: 24px; text-align: center; font-size: 14px; font-weight: 600; color: #1f2937;">0</span>
                    <button class="text-size-btn" data-action="increase" style="width: 32px; height: 32px; border: 1px solid #d1d5db; border-radius: 6px; background: white; cursor: pointer; font-weight: bold; color: #6b7280;">+</button>
                  </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 14px; color: #1f2937; font-weight: 500;">${t.contrastMode}</span>
                  <select id="contrast-select" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: white; font-size: 12px;">
                    <option value="default">Standard</option>
                    <option value="increased">Erhöht</option>
                    <option value="high">Hoch</option>
                    <option value="inverted">Invertiert</option>
                  </select>
                </div>
                
                <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                  <span style="font-size: 14px; color: #1f2937; font-weight: 500;">${t.darkMode}</span>
                  <input type="checkbox" id="dark-mode-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                </label>
              </div>
            </div>
          </div>
          
          <!-- Vision Tab -->
          <div id="vision-tab" style="padding: 20px; display: none;">
            <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase;">VISION & DARSTELLUNG</h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span style="font-size: 14px; color: #1f2937; font-weight: 500;">${t.highlightLinks}</span>
                <input type="checkbox" id="highlight-links-toggle" style="width: 20px; height: 20px; cursor: pointer;">
              </label>
              <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span style="font-size: 14px; color: #1f2937; font-weight: 500;">${t.highlightTitles}</span>
                <input type="checkbox" id="highlight-titles-toggle" style="width: 20px; height: 20px; cursor: pointer;">
              </label>
            </div>
          </div>
          
          <!-- Content Tab -->
          <div id="content-tab" style="padding: 20px; display: none;">
            <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase;">INHALTS-ANPASSUNGEN</h3>
            <p style="color: #6b7280; font-size: 14px;">Weitere Optionen folgen...</p>
          </div>
          
          <!-- Navigation Tab -->
          <div id="navigation-tab" style="padding: 20px; display: none;">
            <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase;">NAVIGATIONS-HILFEN</h3>
            <p style="color: #6b7280; font-size: 14px;">Weitere Optionen folgen...</p>
          </div>
        </div>
      </div>
    `;
  }

  // Switch tabs
  function switchTab(tabId) {
    currentTab = tabId;
    
    // Hide all tabs
    const tabs = ['profiles', 'vision', 'content', 'navigation'];
    tabs.forEach(tab => {
      const tabContent = document.getElementById(`${tab}-tab`);
      const tabButton = document.querySelector(`[data-tab="${tab}"]`);
      if (tabContent) tabContent.style.display = 'none';
      if (tabButton) {
        tabButton.style.borderBottom = '2px solid transparent';
        tabButton.style.color = '#6b7280';
      }
    });
    
    // Show active tab
    const activeTab = document.getElementById(`${tabId}-tab`);
    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeTab) activeTab.style.display = 'block';
    if (activeButton) {
      activeButton.style.borderBottom = '2px solid #1976D2';
      activeButton.style.color = '#1976D2';
    }
  }

  // Setup panel events
  function setupPanelEvents(panel) {
    // Close button
    panel.querySelector('#close-btn').addEventListener('click', toggleWidget);
    
    // Reset button
    panel.querySelector('#reset-btn').addEventListener('click', resetSettings);
    
    // Tab buttons
    panel.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        switchTab(tabId);
      });
    });
    
    // Language select
    panel.querySelector('#language-select').addEventListener('change', function() {
      config.language = this.value;
      // Reload panel with new language
      panel.innerHTML = createPanelHTML();
      setupPanelEvents(panel);
      updateUI();
    });
    
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
