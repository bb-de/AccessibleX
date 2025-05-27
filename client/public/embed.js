/**
 * AccessibleX Widget Embed - Button mit Panel
 * Erstellt Button basierend auf WidgetButton.tsx und lädt Panel via iframe
 */
(function() {
  'use strict';
  
  // Prevent multiple instances
  if (window.AccessibleXWidget) {
    return;
  }
  
  window.AccessibleXWidget = true;

  let isOpen = false;
  let widgetPanel = null;
  let widgetButton = null;

  // Configuration from script tag
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  
  const config = {
    position: currentScript.dataset.position || 'bottom-right',
    language: currentScript.dataset.language || 'de',
    color: currentScript.dataset.color || '#0055A4'
  };

  // Button erstellen basierend auf WidgetButton.tsx
  function createWidgetButton() {
    // Container div (entspricht className="fixed bottom-4 right-4 z-[9999]")
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 9999;
    `;

    // Button (entspricht den WidgetButton.tsx Styles)
    const button = document.createElement('button');
    button.id = 'accessibility-toggle';
    button.setAttribute('aria-label', 'Open accessibility menu');
    button.setAttribute('aria-expanded', 'false');
    button.style.cssText = `
      border-radius: 50%;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      outline: none;
    `;

    // Image (entspricht dem img aus WidgetButton.tsx)
    const img = document.createElement('img');
    img.src = 'https://accessiblex.netlify.app/assets/widget-button-logo.png';
    img.alt = 'Accessibility';
    img.style.cssText = `
      width: 100%;
      height: 100%;
      border-radius: 50%;
    `;

    // Hover-Effekte
    button.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    });

    // Focus-Effekte
    button.addEventListener('focus', function() {
      this.style.outline = '2px solid';
      this.style.outlineColor = config.color;
      this.style.outlineOffset = '2px';
    });
    
    button.addEventListener('blur', function() {
      this.style.outline = 'none';
    });

    // Click-Handler
    button.addEventListener('click', togglePanel);

    button.appendChild(img);
    container.appendChild(button);
    document.body.appendChild(container);
    
    widgetButton = button;
  }

  // Panel als iframe laden (verwendet vorhandene PanelOnly.tsx)
  function createWidgetPanel() {
    const iframe = document.createElement('iframe');
    iframe.id = 'accessibility-panel-iframe';
    iframe.src = 'https://accessiblex.netlify.app/panel-only';
    iframe.style.cssText = `
      position: fixed;
      right: 16px;
      bottom: 90px;
      width: 340px;
      height: 500px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 9998;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(iframe);
    widgetPanel = iframe;
    
    return iframe;
  }

  // Panel öffnen
  function openPanel() {
    if (!widgetPanel) createWidgetPanel();
    
    isOpen = true;
    widgetPanel.style.transform = 'translateY(0)';
    widgetPanel.style.opacity = '1';
    widgetPanel.style.visibility = 'visible';
    
    if (widgetButton) {
      widgetButton.setAttribute('aria-label', 'Close accessibility menu');
      widgetButton.setAttribute('aria-expanded', 'true');
    }
  }

  // Panel schließen
  function closePanel() {
    if (!widgetPanel) return;
    
    isOpen = false;
    widgetPanel.style.transform = 'translateY(-100%)';
    widgetPanel.style.opacity = '0';
    widgetPanel.style.visibility = 'hidden';
    
    if (widgetButton) {
      widgetButton.setAttribute('aria-label', 'Open accessibility menu');
      widgetButton.setAttribute('aria-expanded', 'false');
    }
  }

  // Panel umschalten
  function togglePanel() {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  // Klicks außerhalb schließen das Panel
  document.addEventListener('click', function(e) {
    if (isOpen && widgetPanel && !widgetPanel.contains(e.target) && !widgetButton.contains(e.target)) {
      closePanel();
    }
  });

  // Initialize
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createWidgetButton);
    } else {
      createWidgetButton();
    }
  }

  init();
})();
