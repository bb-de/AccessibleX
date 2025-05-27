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
    // URL zum bestehenden Widget
    widgetUrl: 'https://25b615b4-07e9-4029-b10c-54fd7e4f443c-00-2t2kt5l2qjeqe.spock.replit.dev'
  };

  // Create widget button - genau wie im bestehenden System
  function createButton() {
    const button = document.createElement('button');
    button.id = 'accessiblex-widget-button';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 5.5 14.6 5.4 14.5 5.3L13 4.4C12.6 4.1 12.1 4.1 11.7 4.4L10.2 5.3C10 5.4 9.8 5.5 9.6 5.5L3 7V9L9.5 7.5C9.7 7.5 9.9 7.4 10.1 7.3L12 6.1L13.9 7.3C14.1 7.4 14.3 7.5 14.5 7.5L21 9Z"/>
      </svg>
    `;
    
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: config.color,
      color: 'white',
      cursor: 'pointer',
      zIndex: '999999',
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    });

    // Beim Klick: Vollbild-Modal mit dem bestehenden Widget laden
    button.addEventListener('click', function() {
      openWidgetModal();
    });
    
    document.body.appendChild(button);
    return button;
  }

  // Modal mit dem bestehenden Widget öffnen
  function openWidgetModal() {
    const modal = document.createElement('div');
    modal.id = 'accessiblex-widget-modal';
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 999999; display: flex; align-items: center; justify-content: center;">
        <div style="position: relative; width: 90%; max-width: 1200px; height: 90%; background: white; border-radius: 16px; overflow: hidden;">
          <button onclick="closeWidgetModal()" style="position: absolute; top: 20px; right: 20px; background: #f0f0f0; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; z-index: 1000000; font-size: 20px;">×</button>
          <iframe src="${config.widgetUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  // Modal schließen
  window.closeWidgetModal = function() {
    const modal = document.getElementById('accessiblex-widget-modal');
    if (modal) {
      modal.remove();
    }
  };

  // Modal bei ESC schließen
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeWidgetModal();
    }
  });

  // Initialize widget button
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createButton);
    } else {
      createButton();
    }
  }

  init();
})();
