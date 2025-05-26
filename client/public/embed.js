/**
 * AccessibleX Widget - Komplettes Widget mit allen Funktionen
 * Basiert auf den Referenzbildern mit Vision, Content, Navigation Tabs
 */

(function() {
  'use strict';
  
  // Prevent multiple instances
  if (window.AccessibleXWidget) {
    return;
  }
  
  window.AccessibleXWidget = true;
  
  // Configuration
  const DEFAULT_CONFIG = {
    position: 'bottom-right',
    language: 'en',
    color: '#1976D2'
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
  let currentTab = 'profiles';
  let settings = {
    textSize: 0,
    contrastMode: 'default',
    darkMode: false,
    saturation: 100,
    monochrome: 0,
    highlightLinks: false,
    highlightTitles: false,
    textToSpeech: false,
    readingMask: false,
    readingGuide: false,
    fontFamily: 'default',
    wordSpacing: 0,
    textAlignment: 'default',
    keyboardNavigation: false,
    pageStructure: false,
    stopAnimations: false,
    hideImages: false
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
      accessibilityProfiles: 'ACCESSIBILITY PROFILES',
      contrastAdjustments: 'CONTRAST ADJUSTMENTS',
      colorAdjustments: 'COLOR ADJUSTMENTS',
      textAdjustments: 'TEXT ADJUSTMENTS',
      contentAdjustments: 'CONTENT ADJUSTMENTS',
      readingTools: 'READING TOOLS',
      fontAdjustments: 'FONT ADJUSTMENTS',
      alignmentSpacing: 'ALIGNMENT & SPACING',
      increaseContrast: 'Increase Contrast',
      darkContrast: 'Dark Contrast',
      highContrast: 'High Contrast',
      lightContrast: 'Light Contrast',
      saturation: 'Saturation',
      monochrome: 'Monochrome',
      adjustTextColors: 'Adjust Text Colors',
      adjustTitleColors: 'Adjust Title Colors',
      adjustBackgroundColors: 'Adjust Background Colors',
      textSize: 'Text Size',
      highlightTitles: 'Highlight Titles',
      highlightLinks: 'Highlight Links',
      textToSpeech: 'Text to Speech',
      readingMask: 'Reading Mask',
      readingGuide: 'Reading Guide',
      readableFont: 'Readable Font',
      dyslexiaFont: 'Dyslexia Font',
      resetFont: 'Reset Font',
      wordSpacing: 'Word Spacing',
      textAlignment: 'Text Alignment'
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
      accessibilityProfiles: 'BARRIEREFREIHEITS-PROFILE',
      contrastAdjustments: 'KONTRAST-ANPASSUNGEN',
      colorAdjustments: 'FARB-ANPASSUNGEN',
      textAdjustments: 'TEXT-ANPASSUNGEN',
      contentAdjustments: 'INHALT-ANPASSUNGEN',
      readingTools: 'LESE-WERKZEUGE',
      fontAdjustments: 'SCHRIFT-ANPASSUNGEN',
      alignmentSpacing: 'AUSRICHTUNG & ABSTAND',
      increaseContrast: 'Kontrast erhöhen',
      darkContrast: 'Dunkler Kontrast',
      highContrast: 'Hoher Kontrast',
      lightContrast: 'Heller Kontrast',
      saturation: 'Sättigung',
      monochrome: 'Monochrom',
      adjustTextColors: 'Textfarben anpassen',
      adjustTitleColors: 'Titelfarben anpassen',
      adjustBackgroundColors: 'Hintergrundfarben anpassen',
      textSize: 'Textgröße',
      highlightTitles: 'Titel hervorheben',
      highlightLinks: 'Links hervorheben',
      textToSpeech: 'Text zu Sprache',
      readingMask: 'Lesemaske',
      readingGuide: 'Lesehilfe',
      readableFont: 'Lesbare Schrift',
      dyslexiaFont: 'Legasthenie-Schrift',
      resetFont: 'Schrift zurücksetzen',
      wordSpacing: 'Wortabstand',
      textAlignment: 'Textausrichtung'
    }
  };

  const t = translations[config.language] || translations.en;

  // Create widget button
  function createWidgetButton() {
    const button = document.createElement('button');
    button.id = 'accessiblex-widget-button';
    button.setAttribute('aria-label', 'Open accessibility menu');
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
      background: linear-gradient(135deg, #1976D2 0%, #2196F3 100%);
      padding: 0;
      bottom: 20px;
      right: 20px;
    `;
    
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
      width: 420px;
      height: 700px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
      background: #f8f9fa;
      opacity: 0;
      transform: scale(0.8) translateY(20px);
      transition: all 0.3s ease;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #333;
      overflow: hidden;
      bottom: 90px;
      right: 20px;
    `;
    
    panel.innerHTML = createPanelHTML();
    setupPanelEvents(panel);
    document.body.appendChild(panel);
    return panel;
  }

  // Create panel HTML
  function createPanelHTML() {
    return `
      <div style="height: 100%; display: flex; flex-direction: column; background: #f8f9fa;">
        <!-- Header -->
        <div style="padding: 24px; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center; background: #f8f9fa;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 48px; height: 48px; background: #1976D2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 5.5 14.6 5.4 14.5 5.3L13 4.4C12.6 4.1 12.1 4.1 11.7 4.4L10.2 5.3C10 5.4 9.8 5.5 9.6 5.5L3 7V9L9.5 7.5C9.7 7.5 9.9 7.4 10.1 7.3L12 6.1L13.9 7.3C14.1 7.4 14.3 7.5 14.5 7.5L21 9Z"/>
              </svg>
            </div>
            <span style="font-weight: 600; font-size: 24px; color: #2c3e50;">${t.accessibilityWidget}</span>
          </div>
          <div style="display: flex; gap: 12px; align-items: center;">
            <button id="reset-btn" style="background: none; border: 1px solid #ced4da; border-radius: 8px; padding: 6px 12px; cursor: pointer; font-size: 14px; color: #6c757d; display: flex; align-items: center; gap: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
              </svg>
              ${t.reset}
            </button>
            <button id="close-btn" style="background: none; border: none; cursor: pointer; font-size: 24px; padding: 4px; color: #6c757d;">×</button>
          </div>
        </div>
        
        <!-- Language Selector -->
        <div style="padding: 0 24px 20px 24px; margin-top: 20px;">
          <select id="language-select" style="width: 100%; padding: 12px 16px; border: 1px solid #ced4da; border-radius: 8px; background: white; font-size: 14px; cursor: pointer;">
            <option value="en" ${config.language === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            <option value="de" ${config.language === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
          </select>
        </div>
        
        <!-- Tab Navigation -->
        <div style="display: flex; border-bottom: 1px solid #e9ecef; background: #f8f9fa; padding: 0 24px;">
          <button class="tab-btn" data-tab="profiles" style="flex: 1; padding: 16px 8px; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; border-bottom: 3px solid ${currentTab === 'profiles' ? '#1976D2' : 'transparent'}; color: ${currentTab === 'profiles' ? '#1976D2' : '#6c757d'};">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span style="font-size: 12px; font-weight: 600;">${t.profiles}</span>
          </button>
          <button class="tab-btn" data-tab="vision" style="flex: 1; padding: 16px 8px; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; border-bottom: 3px solid ${currentTab === 'vision' ? '#1976D2' : 'transparent'}; color: ${currentTab === 'vision' ? '#1976D2' : '#6c757d'};">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <span style="font-size: 12px; font-weight: 600;">${t.vision}</span>
          </button>
          <button class="tab-btn" data-tab="content" style="flex: 1; padding: 16px 8px; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; border-bottom: 3px solid ${currentTab === 'content' ? '#1976D2' : 'transparent'}; color: ${currentTab === 'content' ? '#1976D2' : '#6c757d'};">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <span style="font-size: 12px; font-weight: 600;">${t.content}</span>
          </button>
          <button class="tab-btn" data-tab="navigation" style="flex: 1; padding: 16px 8px; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; border-bottom: 3px solid ${currentTab === 'navigation' ? '#1976D2' : 'transparent'}; color: ${currentTab === 'navigation' ? '#1976D2' : '#6c757d'};">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span style="font-size: 12px; font-weight: 600;">${t.navigation}</span>
          </button>
        </div>
        
        <!-- Tab Content -->
        <div style="flex: 1; overflow-y: auto; background: white; margin: 0;">
          ${createTabsContent()}
        </div>
      </div>
    `;
  }

  // Create all tabs content
  function createTabsContent() {
    return `
      <!-- Profiles Tab -->
      <div id="profiles-tab" style="padding: 24px; display: ${currentTab === 'profiles' ? 'block' : 'none'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 0.5px;">${t.accessibilityProfiles}</h3>
          <button id="profiles-reset-btn" style="background: none; border: none; cursor: pointer; font-size: 14px; color: #6c757d; text-decoration: underline;">${t.reset}</button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${createProfileButtons()}
        </div>
      </div>
      
      <!-- Vision Tab -->
      <div id="vision-tab" style="padding: 24px; display: ${currentTab === 'vision' ? 'block' : 'none'};">
        ${createVisionTabContent()}
      </div>
      
      <!-- Content Tab -->
      <div id="content-tab" style="padding: 24px; display: ${currentTab === 'content' ? 'block' : 'none'};">
        ${createContentTabContent()}
      </div>
      
      <!-- Navigation Tab -->
      <div id="navigation-tab" style="padding: 24px; display: ${currentTab === 'navigation' ? 'block' : 'none'};">
        ${createNavigationTabContent()}
      </div>
    `;
  }

  // Create profile buttons
  function createProfileButtons() {
    const profiles = [
      { id: 'visionImpaired', name: t.visionImpaired, icon: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' },
      { id: 'cognitiveDisability', name: t.cognitiveDisability, icon: 'M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z' },
      { id: 'senior', name: t.senior, icon: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z' },
      { id: 'motorImpaired', name: t.motorImpaired, icon: 'M10,2V4.26L8.5,5.15L5,3.5L4,5.5L7.5,7.15L7.5,8.85L4,10.5L5,12.5L8.5,10.85L10,11.74V14H14V11.74L15.5,10.85L19,12.5L20,10.5L16.5,8.85L16.5,7.15L20,5.5L19,3.5L15.5,5.15L14,4.26V2H10M12,6A2,2 0 0,1 14,8A2,2 0 0,1 12,10A2,2 0 0,1 10,8A2,2 0 0,1 12,6Z' },
      { id: 'adhdFriendly', name: t.adhdFriendly, icon: 'M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z' },
      { id: 'dyslexiaFriendly', name: t.dyslexiaFriendly, icon: 'M21,5C19.89,4.65 18.67,4.5 17.5,4.5C15.55,4.5 13.45,4.9 12,6C10.55,4.9 8.45,4.5 6.5,4.5C4.55,4.5 2.45,4.9 1,6V20.65C1,20.9 1.25,21.15 1.5,21.15C1.6,21.15 1.65,21.1 1.75,21.1C3.1,20.45 5.05,20 6.5,20C8.45,20 10.55,20.4 12,21.5C13.35,20.65 15.8,20 17.5,20C19.15,20 20.85,20.3 22.25,21.05C22.35,21.1 22.4,21.1 22.5,21.1C22.75,21.1 23,20.85 23,20.6V6C22.4,5.55 21.75,5.25 21,5M21,18.5C19.9,18.15 18.7,18 17.5,18C15.8,18 13.35,18.65 12,19.5V8C13.35,7.15 15.8,6.5 17.5,6.5C18.7,6.5 19.9,6.65 21,7V18.5Z' }
    ];

    return profiles.map(profile => `
      <button class="profile-btn" data-profile="${profile.id}" style="padding: 24px 16px; border: 1px solid #e9ecef; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.08); min-height: 140px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div style="margin-bottom: 16px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#1976D2">
            <path d="${profile.icon}"/>
          </svg>
        </div>
        <div style="font-size: 15px; font-weight: 600; color: #2c3e50; line-height: 1.3;">${profile.name}</div>
      </button>
    `).join('');
  }

  // Create Vision tab content
  function createVisionTabContent() {
    return `
      <!-- Contrast Adjustments -->
      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 0.5px;">${t.contrastAdjustments}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
          <button class="contrast-btn" data-contrast="increased" style="padding: 16px; border: 1px solid #e9ecef; border-radius: 8px; background: white; cursor: pointer; text-align: center; font-size: 14px; font-weight: 500;">${t.increaseContrast}</button>
          <button class="contrast-btn" data-contrast="dark" style="padding: 16px; border: 1px solid #e9ecef; border-radius: 8px; background: white; cursor: pointer; text-align: center; font-size: 14px; font-weight: 500;">${t.darkContrast}</button>
          <button class="contrast-btn" data-contrast="high" style="padding: 16px; border: 1px solid #e9ecef; border-radius: 8px; background: white; cursor: pointer; text-align: center; font-size: 14px; font-weight: 500;">${t.highContrast}</button>
          <button class="contrast-btn" data-contrast="light" style="padding: 16px; border: 1px solid #e9ecef; border-radius: 8px; background: white; cursor: pointer; text-align: center; font-size: 14px; font-weight: 500;">${t.lightContrast}</button>
        </div>
      </div>

      <!-- Color Adjustments -->
      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 0.5px;">${t.colorAdjustments}</h3>
        
        <!-- Saturation -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 14px; color: #495057; font-weight: 500;">${t.saturation}</span>
            <span id="saturation-value" style="font-size: 14px; color: #6c757d; font-weight: 600;">${settings.saturation}%</span>
          </div>
          <div style="position: relative; height: 8px; background: #e9ecef; border-radius: 4px;">
            <input type="range" id="saturation-slider" min="0" max="200" value="${settings.saturation}" style="position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
            <div style="position: absolute; height: 100%; background: linear-gradient(90deg, #1976D2, #2196F3); border-radius: 4px; width: ${settings.saturation/2}%;"></div>
            <div style="position: absolute; top: -4px; left: ${settings.saturation/2}%; width: 16px; height: 16px; background: white; border: 2px solid #1976D2; border-radius: 50%; transform: translateX(-50%);"></div>
          </div>
        </div>

        <!-- Monochrome -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 14px; color: #495057; font-weight: 500;">${t.monochrome}</span>
            <span id="monochrome-value" style="font-size: 14px; color: #6c757d; font-weight: 600;">${settings.monochrome}%</span>
          </div>
          <div style="position: relative; height: 8px; background: #e9ecef; border-radius: 4px;">
            <input type="range" id="monochrome-slider" min="0" max="100" value="${settings.monochrome}" style="position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
            <div style="position: absolute; height: 100%; background: linear-gradient(90deg, #6c757d, #495057); border-radius: 4px; width: ${settings.monochrome}%;"></div>
            <div style="position: absolute; top: -4px; left: ${settings.monochrome}%; width: 16px; height: 16px; background: white; border: 2px solid #6c757d; border-radius: 50%; transform: translateX(-50%);"></div>
          </div>
        </div>

        <!-- Color Toggles -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 14px; color: #495057; font-weight: 500;">${t.adjustTextColors}</span>
            <div style="position: relative; width: 48px; height: 24px; background: #e9ecef; border-radius: 12px; transition: background 0.3s;">
              <input type="checkbox" id="adjust-text-colors" style="opacity: 0; position: absolute;">
              <div style="position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </label>
          
          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 14px; color: #495057; font-weight: 500;">${t.adjustTitleColors}</span>
            <div style="position: relative; width: 48px; height: 24px; background: #e9ecef; border-radius: 12px; transition: background 0.3s;">
              <input type="checkbox" id="adjust-title-colors" style="opacity: 0; position: absolute;">
              <div style="position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </label>
          
          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 14px; color: #495057; font-weight: 500;">${t.adjustBackgroundColors}</span>
            <div style="position: relative; width: 48px; height: 24px; background: #e9ecef; border-radius: 12px; transition: background 0.3s;">
              <input type="checkbox" id="adjust-bg-colors" style="opacity: 0; position: absolute;">
              <div style="position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </label>
        </div>
      </div>

      <!-- Text Adjustments -->
      <div>
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 0.5px;">${t.textAdjustments}</h3>
        
        <!-- Text Size -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <span style="font-size: 14px; color: #495057; font-weight: 500;">${t.textSize}</span>
          <div style="display: flex; gap: 12px; align-items: center;">
            <button class="text-size-btn" data-action="decrease" style="width: 36px; height: 36px; border: 1px solid #ced4da; border-radius: 6px; background: white; cursor: pointer; font-weight: bold; color: #6c757d; display: flex; align-items: center; justify-content: center;">−</button>
            <span id="text-size-display" style="min-width: 32px; text-align: center; font-size: 16px; font-weight: 600; color: #495057;">${settings.textSize}</span>
            <button class="text-size-btn" data-action="increase" style="width: 36px; height: 36px; border: 1px solid #ced4da; border-radius: 6px; background: white; cursor: pointer; font-weight: bold; color: #6c757d; display: flex; align-items: center; justify-content: center;">+</button>
          </div>
        </div>
      </div>
    `;
  }

  // Create Content tab content
  function createContentTabContent() {
    return `
      <!-- Content Adjustments -->
      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 0.5px;">${t.contentAdjustments}</h3>
        
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 15px; color: #495057; font-weight: 500;">${t.highlightTitles}</span>
            <div style="position: relative; width: 52px; height: 28px; background: ${settings.highlightTitles ? '#1976D2' : '#e9ecef'}; border-radius: 14px; transition: background 0.3s;">
              <input type="checkbox" id="highlight-titles" ${settings.highlightTitles ? 'checked' : ''} style="opacity: 0; position: absolute;">
              <div style="position: absolute; top: 2px; left: ${settings.highlightTitles ? '26px' : '2px'}; width: 24px; height: 24px; background: white; border-radius: 50%; transition: left 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </label>
          
          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 15px; color: #495057; font-weight: 500;">${t.highlightLinks}</span>
            <div style="position: relative; width: 52px; height: 28px; background: ${settings.highlightLinks ? '#1976D2' : '#e9ecef'}; border-radius: 14px; transition: background 0.3s;">
              <input type="checkbox" id="highlight-links" ${settings.highlightLinks ? 'checked' : ''} style="opacity: 0; position: absolute;">
              <div style="position: absolute; top: 2px; left: ${settings.highlightLinks ? '26px' : '2px'}; width: 24px; height: 24px; background: white; border-radius: 50%; transition: left 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </label>
          
          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 15px; color: #495057; font-weight: 500;">${t.textToSpeech}</span>
            <div style="position: relative; width: 52px; height: 28px; background: ${settings.textToSpeech ? '#1976D2' : '#e9ecef'}; border-radius: 14px; transition: background 0.3s;">
              <input type="checkbox" id="text-to-speech" ${settings.textToSpeech ? 'checked' : ''} style="opacity: 0; position: absolute;">
              <div style="position: absolute; top: 2px; left: ${settings.textToSpeech ? '26px' : '2px'}; width: 24px; height: 24px; background: white; border-radius: 50%; transition: left 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </label>
        </div>
      </div>

      <!-- Reading Tools -->
      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 0.5px;">${t.readingTools}</h3>
        
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 15px; color: #495057; font-weight: 500;">${t.readingMask}</span>
            <div style="position: relative; width: 52px; height: 28px; background: ${settings.readingMask ? '#1976D2' : '#e9ecef'}; border-radius: 14px; transition: background 0.3s;">
              <input type="checkbox" id="reading-mask" ${settings.readingMask ? 'checked' : ''} style="opacity: 0; position: absolute;">
              <div style="position: absolute; top: 2px; left: ${settings.readingMask ? '26px' : '2px'}; width: 24px; height: 24px; background: white; border-radius: 50%; transition: left 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </label>
          
          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 15px; color: #495057; font-weight: 500;">${t.readingGuide}</span>
            <div style="position: relative; width: 52px; height: 28px; background: ${settings.readingGuide ? '#1976D2' : '#e9ecef'}; border-radius: 14px; transition: background 0.3s;">
              <input type="checkbox" id="reading-guide" ${settings.readingGuide ? 'checked' : ''} style="opacity: 0; position: absolute;">
              <div style="position: absolute; top: 2px; left: ${settings.readingGuide ? '26px' : '2px'}; width: 24px; height: 24px; background: white; border-radius: 50%; transition: left 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </label>
        </div>
      </div>

      <!-- Font Adjustments -->
      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 0.5px;">${t.fontAdjustments}</h3>
        
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <button class="font-btn" data-font="readable" style="flex: 1; padding: 12px; border: 1px solid #e9ecef; border-radius: 8px; background: white; cursor: pointer; text-align: center; font-size: 14px; font-weight: 500;">${t.readableFont}</button>
          <button class="font-btn" data-font="dyslexic" style="flex: 1; padding: 12px; border: 1px solid #e9ecef; border-radius: 8px; background: white; cursor: pointer; text-align: center; font-size: 14px; font-weight: 500;">${t.dyslexiaFont}</button>
        </div>
        
        <button id="reset-font-btn" style="padding: 12px 24px; border: none; border-radius: 8px; background: #1976D2; color: white; cursor: pointer; font-size: 14px; font-weight: 500; width: 100%;">${t.resetFont}</button>
      </div>

      <!-- Alignment & Spacing -->
      <div>
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 0.5px;">${t.alignmentSpacing}</h3>
        
        <!-- Word Spacing -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 14px; color: #495057; font-weight: 500;">${t.wordSpacing}</span>
            <span id="word-spacing-value" style="font-size: 14px; color: #6c757d; font-weight: 600;">${settings.wordSpacing}%</span>
          </div>
          <div style="position: relative; height: 8px; background: #e9ecef; border-radius: 4px;">
            <input type="range" id="word-spacing-slider" min="0" max="100" value="${settings.wordSpacing}" style="position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
            <div style="position: absolute; height: 100%; background: linear-gradient(90deg, #1976D2, #2196F3); border-radius: 4px; width: ${settings.wordSpacing}%;"></div>
            <div style="position: absolute; top: -4px; left: ${settings.wordSpacing}%; width: 16px; height: 16px; background: white; border: 2px solid #1976D2; border-radius: 50%; transform: translateX(-50%);"></div>
          </div>
        </div>

        <!-- Text Alignment -->
        <div>
          <div style="margin-bottom: 8px;">
            <span style="font-size: 14px; color: #495057; font-weight: 500;">${t.textAlignment}</span>
          </div>
          <select id="text-alignment-select" style="width: 100%; padding: 12px 16px; border: 1px solid #ced4da; border-radius: 8px; background: white; font-size: 14px; cursor: pointer;">
            <option value="default">Default</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
      </div>
    `;
  }

  // Create Navigation tab content
  function createNavigationTabContent() {
    return `
      <div style="text-align: center; padding: 40px 20px;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#6c757d" style="margin-bottom: 20px;">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #495057;">Navigation Features</h3>
        <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.5;">Advanced navigation and keyboard accessibility features will be available in the next update.</p>
      </div>
    `;
  }

  // Setup panel events
  function setupPanelEvents(panel) {
    // Close button
    panel.querySelector('#close-btn').addEventListener('click', toggleWidget);
    
    // Reset buttons
    panel.querySelector('#reset-btn').addEventListener('click', resetAllSettings);
    if (panel.querySelector('#profiles-reset-btn')) {
      panel.querySelector('#profiles-reset-btn').addEventListener('click', resetAllSettings);
    }
    
    // Language select
    panel.querySelector('#language-select').addEventListener('change', function() {
      config.language = this.value;
      const currentOpenTab = currentTab;
      panel.innerHTML = createPanelHTML();
      setupPanelEvents(panel);
      switchTab(currentOpenTab);
    });
    
    // Tab buttons
    panel.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        switchTab(tabId);
      });
    });
    
    // Profile buttons
    panel.querySelectorAll('.profile-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const profile = this.dataset.profile;
        applyProfile(profile);
        
        // Visual feedback
        panel.querySelectorAll('.profile-btn').forEach(b => {
          b.style.background = 'white';
          b.style.borderColor = '#e9ecef';
          b.style.transform = 'scale(1)';
        });
        this.style.background = '#e3f2fd';
        this.style.borderColor = '#1976D2';
        this.style.transform = 'scale(1.02)';
      });
      
      btn.addEventListener('mouseenter', function() {
        if (this.style.background !== '#e3f2fd') {
          this.style.background = '#f8f9fa';
          this.style.transform = 'scale(1.02)';
        }
      });
      
      btn.addEventListener('mouseleave', function() {
        if (this.style.background !== '#e3f2fd') {
          this.style.background = 'white';
          this.style.transform = 'scale(1)';
        }
      });
    });

    // Vision tab controls
    setupVisionControls(panel);
    
    // Content tab controls
    setupContentControls(panel);
  }

  // Setup vision controls
  function setupVisionControls(panel) {
    // Contrast buttons
    panel.querySelectorAll('.contrast-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const contrastType = this.dataset.contrast;
        settings.contrastMode = contrastType;
        applyAccessibilityChanges();
        
        // Visual feedback
        panel.querySelectorAll('.contrast-btn').forEach(b => b.style.background = 'white');
        this.style.background = '#e3f2fd';
      });
    });

    // Sliders
    const saturationSlider = panel.querySelector('#saturation-slider');
    if (saturationSlider) {
      saturationSlider.addEventListener('input', function() {
        settings.saturation = parseInt(this.value);
        panel.querySelector('#saturation-value').textContent = settings.saturation + '%';
        applyAccessibilityChanges();
      });
    }

    const monochromeSlider = panel.querySelector('#monochrome-slider');
    if (monochromeSlider) {
      monochromeSlider.addEventListener('input', function() {
        settings.monochrome = parseInt(this.value);
        panel.querySelector('#monochrome-value').textContent = settings.monochrome + '%';
        applyAccessibilityChanges();
      });
    }

    // Text size buttons
    panel.querySelectorAll('.text-size-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.dataset.action;
        if (action === 'increase' && settings.textSize < 5) {
          settings.textSize++;
        } else if (action === 'decrease' && settings.textSize > -3) {
          settings.textSize--;
        }
        panel.querySelector('#text-size-display').textContent = settings.textSize;
        applyAccessibilityChanges();
      });
    });
  }

  // Setup content controls
  function setupContentControls(panel) {
    // Toggle switches
    const toggles = [
      { id: 'highlight-titles', setting: 'highlightTitles' },
      { id: 'highlight-links', setting: 'highlightLinks' },
      { id: 'text-to-speech', setting: 'textToSpeech' },
      { id: 'reading-mask', setting: 'readingMask' },
      { id: 'reading-guide', setting: 'readingGuide' }
    ];

    toggles.forEach(toggle => {
      const element = panel.querySelector(`#${toggle.id}`);
      if (element) {
        element.addEventListener('change', function() {
          settings[toggle.setting] = this.checked;
          applyAccessibilityChanges();
          
          // Update UI
          const container = this.parentElement;
          const slider = container.querySelector('div:last-child');
          const bg = container;
          
          if (this.checked) {
            bg.style.background = '#1976D2';
            slider.style.left = '26px';
          } else {
            bg.style.background = '#e9ecef';
            slider.style.left = '2px';
          }
        });
      }
    });

    // Font buttons
    panel.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const fontType = this.dataset.font;
        settings.fontFamily = fontType;
        applyAccessibilityChanges();
        
        // Visual feedback
        panel.querySelectorAll('.font-btn').forEach(b => b.style.background = 'white');
        this.style.background = '#e3f2fd';
      });
    });

    // Reset font button
    const resetFontBtn = panel.querySelector('#reset-font-btn');
    if (resetFontBtn) {
      resetFontBtn.addEventListener('click', function() {
        settings.fontFamily = 'default';
        applyAccessibilityChanges();
        
        // Reset visual feedback
        panel.querySelectorAll('.font-btn').forEach(b => b.style.background = 'white');
      });
    }

    // Word spacing slider
    const wordSpacingSlider = panel.querySelector('#word-spacing-slider');
    if (wordSpacingSlider) {
      wordSpacingSlider.addEventListener('input', function() {
        settings.wordSpacing = parseInt(this.value);
        panel.querySelector('#word-spacing-value').textContent = settings.wordSpacing + '%';
        applyAccessibilityChanges();
      });
    }

    // Text alignment select
    const textAlignSelect = panel.querySelector('#text-alignment-select');
    if (textAlignSelect) {
      textAlignSelect.addEventListener('change', function() {
        settings.textAlignment = this.value;
        applyAccessibilityChanges();
      });
    }
  }

  // Switch tabs
  function switchTab(tabId) {
    currentTab = tabId;
    
    const panel = document.getElementById('accessiblex-widget-panel');
    
    // Update tab content
    const tabContent = panel.querySelector('.tab-content');
    if (tabContent) {
      tabContent.innerHTML = createTabsContent();
    } else {
      // Find tab content container and update
      const contentContainer = panel.querySelector('[style*="flex: 1; overflow-y: auto"]');
      if (contentContainer) {
        contentContainer.innerHTML = createTabsContent();
      }
    }
    
    // Update tab buttons
    panel.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.style.borderBottom = '3px solid #1976D2';
        btn.style.color = '#1976D2';
      } else {
        btn.style.borderBottom = '3px solid transparent';
        btn.style.color = '#6c757d';
      }
    });

    // Re-setup events for new content
    setupPanelEvents(panel);
  }

  // Apply profile
  function applyProfile(profileId) {
    console.log('Applying profile:', profileId);
    
    // Reset settings first
    resetAllSettings(false);
    
    // Apply profile-specific settings
    switch (profileId) {
      case 'visionImpaired':
        settings.textSize = 2;
        settings.contrastMode = 'increased';
        settings.fontFamily = 'readable';
        break;
      case 'cognitiveDisability':
        settings.fontFamily = 'readable';
        settings.highlightTitles = true;
        settings.readingGuide = true;
        break;
      case 'senior':
        settings.textSize = 2;
        settings.contrastMode = 'increased';
        settings.fontFamily = 'readable';
        settings.highlightLinks = true;
        break;
      case 'motorImpaired':
        settings.highlightLinks = true;
        settings.keyboardNavigation = true;
        break;
      case 'adhdFriendly':
        settings.highlightTitles = true;
        settings.readingMask = true;
        settings.stopAnimations = true;
        break;
      case 'dyslexiaFriendly':
        settings.fontFamily = 'dyslexic';
        settings.readingGuide = true;
        settings.wordSpacing = 20;
        break;
    }
    
    applyAccessibilityChanges();
  }

  // Reset all settings
  function resetAllSettings(updateUI = true) {
    settings = {
      textSize: 0,
      contrastMode: 'default',
      darkMode: false,
      saturation: 100,
      monochrome: 0,
      highlightLinks: false,
      highlightTitles: false,
      textToSpeech: false,
      readingMask: false,
      readingGuide: false,
      fontFamily: 'default',
      wordSpacing: 0,
      textAlignment: 'default',
      keyboardNavigation: false,
      pageStructure: false,
      stopAnimations: false,
      hideImages: false
    };
    
    // Remove existing styles
    const existingStyle = document.getElementById('accessiblex-host-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    if (updateUI) {
      // Reset visual feedback and reload current tab
      const panel = document.getElementById('accessiblex-widget-panel');
      if (panel) {
        switchTab(currentTab);
      }
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
    
    // Contrast modes
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
    } else if (settings.contrastMode === 'dark') {
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
    } else if (settings.contrastMode === 'light') {
      css += `
        body *, html * { 
          background-color: #fafafa !important; 
          color: #333 !important; 
        }
        #accessiblex-widget-button, #accessiblex-widget-panel {
          background-color: initial !important;
          color: initial !important;
        }
      `;
    }

    // Color adjustments
    if (settings.saturation !== 100) {
      css += `
        body *, html * { 
          filter: saturate(${settings.saturation / 100}) !important; 
        }
        #accessiblex-widget-button, #accessiblex-widget-panel {
          filter: none !important;
        }
      `;
    }

    if (settings.monochrome > 0) {
      css += `
        body *, html * { 
          filter: grayscale(${settings.monochrome / 100}) !important; 
        }
        #accessiblex-widget-button, #accessiblex-widget-panel {
          filter: none !important;
        }
      `;
    }
    
    // Highlight links
    if (settings.highlightLinks) {
      css += `
        a { 
          background-color: #ffff00 !important; 
          color: #000 !important; 
          text-decoration: underline !important;
          font-weight: bold !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
        }
      `;
    }
    
    // Highlight titles
    if (settings.highlightTitles) {
      css += `
        h1, h2, h3, h4, h5, h6 { 
          background-color: #ffeb3b !important; 
          color: #000 !important; 
          padding: 8px !important;
          border-left: 4px solid #ff9800 !important;
          margin: 16px 0 !important;
        }
      `;
    }
    
    // Font family
    if (settings.fontFamily === 'readable') {
      css += `
        body *, html * { 
          font-family: Arial, Helvetica, sans-serif !important; 
        }
        #accessiblex-widget-button *, #accessiblex-widget-panel * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      `;
    } else if (settings.fontFamily === 'dyslexic') {
      css += `
        body *, html * { 
          font-family: 'OpenDyslexic', 'Comic Sans MS', Arial, sans-serif !important; 
        }
        #accessiblex-widget-button *, #accessiblex-widget-panel * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      `;
    }

    // Word spacing
    if (settings.wordSpacing > 0) {
      css += `
        body *, html * { 
          word-spacing: ${settings.wordSpacing / 100}em !important; 
        }
        #accessiblex-widget-button *, #accessiblex-widget-panel * {
          word-spacing: normal !important;
        }
      `;
    }

    // Text alignment
    if (settings.textAlignment !== 'default') {
      css += `
        body *, html * { 
          text-align: ${settings.textAlignment} !important; 
        }
        #accessiblex-widget-button *, #accessiblex-widget-panel * {
          text-align: initial !important;
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
    
    // Save settings
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

  // Initialize
  function init() {
    if (document.getElementById('accessiblex-widget-button')) {
      return;
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        createWidgetButton();
        createWidgetPanel();
        loadSavedSettings();
      });
    } else {
      createWidgetButton();
      createWidgetPanel();
      loadSavedSettings();
    }
  }
  
  init();
})();
