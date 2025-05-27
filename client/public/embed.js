/**
 * AccessibleX Widget - Einfache Embed-Version
 * Lädt das schöne React-Widget direkt
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
    // Use current Replit URL as default
    apiEndpoint: currentScript.dataset.apiEndpoint || 'https://25b615b4-07e9-4029-b10c-54fd7e4f443c-00-2t2kt5l2qjeqe.spock.replit.dev'
  };

  // Simple iframe loader for the React widget
  function loadWidget() {
    const iframe = document.createElement('iframe');
    iframe.src = `${config.apiEndpoint}/widget-only`;
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
    
    // Allow pointer events for the widget itself
    iframe.onload = function() {
      // Enable pointer events for widget interaction
      iframe.style.pointerEvents = 'none';
      iframe.contentWindow.postMessage({ 
        type: 'ENABLE_WIDGET_INTERACTION' 
      }, '*');
    };
    
    document.body.appendChild(iframe);
    
    console.log('AccessibleX Widget loaded successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }

})();
