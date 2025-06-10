import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Production CORS und Security Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Optimierte Statische Dateien
app.use(express.static(path.join(__dirname, '..'), {
  maxAge: '1h',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
      res.set('Cache-Control', 'public, max-age=3600, immutable');
    }
  }
}));

// Haupt-Widget-Endpunkte
const widgetEndpoints = [
  '/widget.js',
  '/a11y.js', 
  '/accessibility-widget-complete.js'
];

widgetEndpoints.forEach(endpoint => {
  app.get(endpoint, async (req, res) => {
    try {
      const widgetPath = path.join(__dirname, '..', 'accessibility-widget-complete.js');
      const widgetContent = await readFile(widgetPath, 'utf-8');
      
      res.set({
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, immutable',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
        'ETag': `"${Date.now()}"`
      });
      
      res.send(widgetContent);
    } catch (error) {
      console.error(`Widget loading error for ${endpoint}:`, error);
      res.status(500).send('// Widget loading failed');
    }
  });
});

// Production Test-Seite
app.get('/test', async (req, res) => {
  const testHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Widget - Live Test</title>
    <meta name="description" content="Testen Sie das Accessibility Widget live auf dieser Seite">
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        .status {
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            font-weight: 600;
            text-align: center;
        }
        .status.loading {
            background: #fef3c7;
            color: #92400e;
        }
        .status.success {
            background: #d1fae5;
            color: #065f46;
        }
        .status.error {
            background: #fee2e2;
            color: #991b1b;
        }
        .test-content {
            display: grid;
            gap: 30px;
            margin: 30px 0;
        }
        .test-section {
            padding: 25px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            background: #f9fafb;
        }
        .test-links a {
            display: inline-block;
            margin: 10px 15px 10px 0;
            color: #2563eb;
            text-decoration: underline;
            font-weight: 500;
        }
        .test-buttons button {
            margin: 10px 15px 10px 0;
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        .test-form input, .test-form textarea {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 2px solid #d1d5db;
            border-radius: 8px;
            font-size: 16px;
        }
        .test-text {
            margin: 20px 0;
        }
        .integration-code {
            background: #1f2937;
            color: #10b981;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            margin: 20px 0;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #3b82f6;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Accessibility Widget - Live Test</h1>
            <p>Testen Sie alle Barrierefreiheits-Features in Echtzeit</p>
        </div>
        
        <div id="widget-status" class="status loading">
            Widget wird geladen...
        </div>
        
        <div class="test-content">
            <div class="test-section">
                <h2>Widget-Integration für Ihre Website</h2>
                <p>Kopieren Sie diesen Code vor das schließende &lt;/body&gt; Tag:</p>
                <div class="integration-code">
&lt;script src="${req.protocol}://${req.get('host')}/widget.js"
        data-position="bottom-right"
        data-language="de"
        data-color="#3b82f6"&gt;
&lt;/script&gt;
                </div>
            </div>
            
            <div class="test-section">
                <h3>Test-Links</h3>
                <div class="test-links">
                    <a href="#home">Startseite</a>
                    <a href="#about">Über uns</a>
                    <a href="#services">Leistungen</a>
                    <a href="#contact">Kontakt</a>
                    <a href="#impressum">Impressum</a>
                    <a href="#datenschutz">Datenschutz</a>
                </div>
            </div>
            
            <div class="test-section">
                <h3>Test-Buttons</h3>
                <div class="test-buttons">
                    <button onclick="alert('Button 1 geklickt')">Aktion 1</button>
                    <button onclick="alert('Button 2 geklickt')">Aktion 2</button>
                    <button onclick="alert('Button 3 geklickt')">Aktion 3</button>
                </div>
            </div>
            
            <div class="test-section">
                <h3>Test-Formular</h3>
                <form class="test-form">
                    <label for="test-name">Name:</label>
                    <input type="text" id="test-name" placeholder="Ihr Name">
                    
                    <label for="test-email">E-Mail:</label>
                    <input type="email" id="test-email" placeholder="ihre@email.de">
                    
                    <label for="test-message">Nachricht:</label>
                    <textarea id="test-message" rows="4" placeholder="Ihre Nachricht..."></textarea>
                    
                    <button type="submit">Absenden</button>
                </form>
            </div>
            
            <div class="test-section">
                <h3>Test-Texte</h3>
                <div class="test-text">
                    <h4>Überschrift Level 4</h4>
                    <p>Dies ist ein <strong>normaler Absatz</strong> mit verschiedenen <em>Textformatierungen</em>. 
                    Das Widget kann diese Inhalte für bessere Lesbarkeit anpassen.</p>
                    
                    <h5>Überschrift Level 5</h5>
                    <p>Hier ist ein längerer Text zum Testen der Lesemaske und anderen Textverbesserungen. 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                    ut labore et dolore magna aliqua.</p>
                    
                    <h6>Überschrift Level 6</h6>
                    <ul>
                        <li>Listenelement 1</li>
                        <li>Listenelement 2</li>
                        <li>Listenelement 3</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h4>🔍 Vision</h4>
                <p>Kontrast, Textgröße, Dunkler Modus, Schriftarten</p>
            </div>
            <div class="feature-card">
                <h4>📝 Content</h4>
                <p>Links hervorheben, Lesemaske, Leseführung</p>
            </div>
            <div class="feature-card">
                <h4>🎯 Navigation</h4>
                <p>Tastatur-Navigation, Fokus, Seitenstruktur</p>
            </div>
            <div class="feature-card">
                <h4>👥 Profile</h4>
                <p>6 vordefinierte Benutzerprofile für verschiedene Bedürfnisse</p>
            </div>
        </div>
    </div>
    
    <!-- Widget-Integration -->
    <script src="${req.protocol}://${req.get('host')}/widget.js" 
            data-position="bottom-right" 
            data-language="de" 
            data-color="#3b82f6">
    </script>
    
    <script>
        // Widget-Status prüfen
        function checkWidgetStatus() {
            const statusEl = document.getElementById('widget-status');
            const widgetButton = document.querySelector('.a11y-widget-button');
            
            if (widgetButton) {
                statusEl.textContent = '✅ Widget erfolgreich geladen und funktionsfähig!';
                statusEl.className = 'status success';
                
                // Widget-Info anzeigen
                setTimeout(() => {
                    statusEl.innerHTML = \`
                        ✅ Widget aktiv! Klicken Sie auf den blauen Button unten rechts.<br>
                        <strong>Verfügbare Features:</strong> 6 Profile, 50+ Funktionen, Mehrsprachig
                    \`;
                }, 2000);
            } else {
                statusEl.textContent = '❌ Widget konnte nicht geladen werden.';
                statusEl.className = 'status error';
            }
        }
        
        // Status nach 1 Sekunde prüfen
        setTimeout(checkWidgetStatus, 1000);
        
        // Formular-Submit verhindern (nur Demo)
        document.querySelector('.test-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Demo-Formular eingereicht! (Nur Test)');
        });
        
        // Performance-Tracking
        window.addEventListener('load', function() {
            console.log('Widget-Test-Seite geladen in:', performance.now().toFixed(2) + 'ms');
        });
    </script>
</body>
</html>`;
  
  res.send(testHTML);
});

// API-Endpunkt
app.get('/api/widget-info', (req, res) => {
  res.json({
    name: 'Accessibility Widget Complete',
    version: '2.0.0',
    status: 'production',
    features: {
      profiles: 6,
      functions: '50+',
      languages: ['de', 'en'],
      positions: ['bottom-right', 'bottom-left', 'top-right', 'top-left']
    },
    integration: {
      mainUrl: '/widget.js',
      fullUrl: '/accessibility-widget-complete.js',
      shortUrl: '/a11y.js',
      testPage: '/test',
      documentation: '/docs'
    },
    performance: {
      fileSize: '69 KB',
      loadTime: '< 100ms',
      cache: '1 hour'
    },
    support: 'support@brandingbrothers.de'
  });
});

// Gesundheitscheck für Monitoring
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0'
  });
});

// Haupt-Landing-Page
app.get('/', (req, res) => {
  const landingHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Widget CDN - BrandingBrothers</title>
    <meta name="description" content="Professionelles Accessibility Widget für Barrierefreiheit auf jeder Website. Einfache Integration mit einem Script-Tag.">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .hero {
            text-align: center;
            color: white;
            margin-bottom: 60px;
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        .card {
            background: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            text-align: center;
        }
        .card h3 {
            color: #3b82f6;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        .code-block {
            background: #1f2937;
            color: #10b981;
            padding: 20px;
            border-radius: 12px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            margin: 20px 0;
            overflow-x: auto;
        }
        .btn {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 15px 30px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            margin: 10px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: #2563eb;
            transform: translateY(-2px);
        }
        .btn.secondary {
            background: white;
            color: #3b82f6;
            border: 2px solid #3b82f6;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 12px;
            color: white;
            text-align: center;
        }
        .footer {
            text-align: center;
            color: white;
            margin-top: 60px;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>🚀 Accessibility Widget</h1>
            <p>Professionelle Barrierefreiheit für jede Website. Integration in 2 Minuten mit einem Script-Tag.</p>
        </div>
        
        <div class="cards">
            <div class="card">
                <h3>🧪 Live testen</h3>
                <p>Probieren Sie alle Widget-Features auf unserer interaktiven Test-Seite aus.</p>
                <a href="/test" class="btn">Widget testen</a>
            </div>
            
            <div class="card">
                <h3>⚡ Sofort-Integration</h3>
                <p>Kopieren, einfügen, fertig! Das Widget funktioniert sofort auf jeder Website.</p>
                <div class="code-block">
&lt;script src="${req.protocol}://${req.get('host')}/widget.js"&gt;&lt;/script&gt;
                </div>
            </div>
            
            <div class="card">
                <h3>📊 Widget-Info</h3>
                <p>Technische Details und API-Informationen für Entwickler.</p>
                <a href="/api/widget-info" class="btn secondary">API anzeigen</a>
            </div>
        </div>
        
        <div class="features">
            <div class="feature">
                <h4>6 Profile</h4>
                <p>Vision, Kognitiv, Motor, Senior, ADHD, Lesen</p>
            </div>
            <div class="feature">
                <h4>50+ Funktionen</h4>
                <p>Kontrast, Textgröße, Navigation, Fokus</p>
            </div>
            <div class="feature">
                <h4>Mehrsprachig</h4>
                <p>Deutsch und Englisch</p>
            </div>
            <div class="feature">
                <h4>Mobile-optimiert</h4>
                <p>Funktioniert auf allen Geräten</p>
            </div>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="/test" class="btn" style="font-size: 1.2rem; padding: 20px 40px;">
                Widget jetzt testen →
            </a>
        </div>
        
        <div class="footer">
            <p>Powered by BrandingBrothers.de | Support: support@brandingbrothers.de</p>
            <p>Version 2.0.0 | Produktionsbereit | WCAG 2.1 konform</p>
        </div>
    </div>
</body>
</html>`;
  
  res.send(landingHTML);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    availableEndpoints: [
      '/widget.js',
      '/test', 
      '/api/widget-info',
      '/health',
      '/'
    ]
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Widget service temporarily unavailable'
  });
});

// Server starten
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Accessibility Widget CDN läuft auf Port ${PORT}`);
  console.log(`📱 Widget URL: http://localhost:${PORT}/widget.js`);
  console.log(`🧪 Test-Seite: http://localhost:${PORT}/test`);
  console.log(`🌐 Landing Page: http://localhost:${PORT}/`);
  console.log(`📊 API: http://localhost:${PORT}/api/widget-info`);
  console.log(`✅ Production-ready für Replit Deployment!`);
});

export default app;