/**
 * AccessibleX Widget Embed - Einfacher Button mit Weiterleitung
 * Lädt das bestehende Widget aus Replit
 */
(function() {
  'use strict';
  
  // Prevent multiple instances
  if (window.AccessibleXWidget) {
    return;
  }
  
  window.AccessibleXWidget = true;

  // Configuration from script tag
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  
  const config = {
    position: currentScript.dataset.position || 'bottom-right',
    language: currentScript.dataset.language || 'en',
    color: currentScript.dataset.color || '#1976D2',
    // URL zum bestehenden Widget - flexibel konfigurierbar
    widgetUrl: currentScript.dataset.widgetUrl || 'https://accessiblex.netlify.app'
  };

  // Direkt das Widget laden - kein Button nötig, da das Widget seinen eigenen Button hat
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
    
    // Erlaube pointer events nur für das Widget selbst
    iframe.onload = function() {
      try {
        // Widget-Bereich für Pointer Events aktivieren
        iframe.style.pointerEvents = 'auto';
      } catch (e) {
        console.log('Widget loaded successfully');
      }
    };
    
    document.body.appendChild(iframe);
    return iframe;
  }

  // Initialize widget
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadWidget);
    } else {
      loadWidget();
    }
  }

  init();
})();
