/**
 * Barrierefreiheit-Widget Loader (GitHub Pages Version)
 * Sichere und konfliktfreie Integration in jede Webseite
 * Version 1.0.0
 */
(function(window, document) {
  'use strict';
  
  // Automatische Erkennung der Basis-URL
  function getBaseUrl() {
    // Aktuelles Skript finden
    const scripts = document.getElementsByTagName('script');
    let scriptUrl = '';
    
    // Durch alle Skripte iterieren und das aktuelle finden
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.includes('github-widget-loader.js')) {
        scriptUrl = scripts[i].src;
        break;
      }
    }
    
    // Basis-URL ermitteln (alles bis zum letzten Slash)
    if (scriptUrl) {
      return scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
    }
    
    // Fallback auf relativen Pfad
    return './';
  }
  
  // Widget laden
  function loadWidget() {
    const baseUrl = getBaseUrl();
    console.log('Erkannte Basis-URL:', baseUrl);
    
    // Konfiguration aus Skript-Attributen laden
    const scriptTag = document.currentScript || document.querySelector('script[src*="github-widget-loader.js"]');
    const config = {
      position: scriptTag.getAttribute('data-position') || 'right',
      language: scriptTag.getAttribute('data-lang') || 'de',
      theme: scriptTag.getAttribute('data-theme') || 'default',
      debug: scriptTag.getAttribute('data-debug') === 'true'
    };
    
    // 1. CSS laden
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = baseUrl + 'widget-styles.css';
    document.head.appendChild(styleLink);
    
    // 2. Helfer-Skript laden
    const helperScript = document.createElement('script');
    helperScript.src = baseUrl + 'widget-a11y-helpers.js';
    helperScript.onload = function() {
      console.log('A11y Helpers geladen');
      
      // 3. Element-Skript laden
      const elementScript = document.createElement('script');
      elementScript.src = baseUrl + 'widget-element.js';
      elementScript.onload = function() {
        console.log('Widget Element geladen');
        
        // 4. Widget initialisieren
        if (window.A11yWidgetElement && typeof window.A11yWidgetElement.init === 'function') {
          window.A11yWidgetElement.init(config);
          console.log('Widget initialisiert mit Konfiguration:', config);
        } else {
          console.error('Widget konnte nicht initialisiert werden. Element nicht gefunden.');
        }
      };
      elementScript.onerror = function() {
        console.error('Fehler beim Laden von widget-element.js');
      };
      document.body.appendChild(elementScript);
    };
    helperScript.onerror = function() {
      console.error('Fehler beim Laden von widget-a11y-helpers.js');
    };
    document.body.appendChild(helperScript);
  }
  
  // Widget laden, wenn DOM bereit ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
  
})(window, document);