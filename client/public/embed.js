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
  let currentTab = 'profiles';
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
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 5.5 14.6 5.4 14.5 5.3L13 4.4C12.6 4.1 12.1 4.1 11.7 4.4L10.2
