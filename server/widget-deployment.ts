import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// CORS-Header für Cross-Origin-Requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Statische Dateien servieren
app.use(express.static(path.join(__dirname, '..'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
      res.set('Cache-Control', 'public, max-age=3600'); // 1 Stunde Cache
    }
  }
}));

// Widget-spezifische Routen
app.get('/widget', async (req, res) => {
  try {
    const widgetPath = path.join(__dirname, '..', 'accessibility-widget-complete.js');
    const widgetContent = await readFile(widgetPath, 'utf-8');
    
    res.set({
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    });
    
    res.send(widgetContent);
  } catch (error) {
    console.error('Widget loading error:', error);
    res.status(500).send('// Widget loading failed');
  }
});

// Widget mit CDN-freundlicher URL
app.get('/accessibility-widget-complete.js', async (req, res) => {
  try {
    const widgetPath = path.join(__dirname, '..', 'accessibility-widget-complete.js');
    const widgetContent = await readFile(widgetPath, 'utf-8');
    
    res.set({
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff'
    });
    
    res.send(widgetContent);
  } catch (error) {
    console.error('Widget loading error:', error);
    res.status(500).send('// Widget loading failed');
  }
});

// Kurze URLs für einfache Integration
app.get('/a11y.js', async (req, res) => {
  res.redirect('/accessibility-widget-complete.js');
});

app.get('/widget.js', async (req, res) => {
  res.redirect('/accessibility-widget-complete.js');
});

// Test-Seite für Widget-Funktionalität
app.get('/test', async (req, res) => {
  const testHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Widget Test - Accessibility Complete</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
        }
        .test-section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .test-link {
            color: #0066cc;
            text-decoration: underline;
            margin: 0 10px;
        }
        .test-button {
            background: #0066cc;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 5px;
        }
        .test-form {
            margin: 20px 0;
        }
        .test-form input, .test-form textarea {
            display: block;
            width: 100%;
            margin: 10px 0;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <h1>Accessibility Widget Test-Seite</h1>
    
    <div class="test-section">
        <h2>Test-Inhalte für Widget-Funktionen</h2>
        <p>Diese Seite testet alle Accessibility-Features des Widgets.</p>
        
        <h3>Links zum Testen</h3>
        <a href="#" class="test-link">Test Link 1</a>
        <a href="#" class="test-link">Test Link 2</a>
        <a href="#" class="test-link">Test Link 3</a>
        
        <h3>Buttons zum Testen</h3>
        <button class="test-button">Test Button 1</button>
        <button class="test-button">Test Button 2</button>
        <button class="test-button">Test Button 3</button>
        
        <h3>Formulare zum Testen</h3>
        <form class="test-form">
            <label for="test-input">Test Input:</label>
            <input type="text" id="test-input" placeholder="Eingabe hier...">
            
            <label for="test-textarea">Test Textarea:</label>
            <textarea id="test-textarea" placeholder="Längerer Text hier..."></textarea>
            
            <button type="submit" class="test-button">Absenden</button>
        </form>
        
        <h3>Text-Inhalte zum Testen</h3>
        <p>Dieser Paragraph testet die Textgröße-Anpassung und andere typografische Features des Widgets.</p>
        <p><strong>Dieser Text ist fett</strong> und <em>dieser Text ist kursiv</em>.</p>
        
        <h4>Überschriften-Hierarchie</h4>
        <h5>Unterüberschrift Level 5</h5>
        <h6>Unterüberschrift Level 6</h6>
    </div>
    
    <div class="test-section">
        <h2>Widget-Status</h2>
        <p id="widget-status">Widget wird geladen...</p>
    </div>
    
    <!-- Widget-Integration -->
    <script src="/accessibility-widget-complete.js" 
            data-position="bottom-right" 
            data-language="de" 
            data-color="#0066cc">
    </script>
    
    <script>
        // Test ob Widget geladen wurde
        setTimeout(() => {
            const statusEl = document.getElementById('widget-status');
            const widgetButton = document.querySelector('.a11y-widget-button');
            
            if (widgetButton) {
                statusEl.textContent = '✅ Widget erfolgreich geladen und funktionsfähig!';
                statusEl.style.color = 'green';
            } else {
                statusEl.textContent = '❌ Widget konnte nicht geladen werden.';
                statusEl.style.color = 'red';
            }
        }, 1000);
    </script>
</body>
</html>`;
  
  res.send(testHTML);
});

// API-Endpunkt für Widget-Info
app.get('/api/widget-info', (req, res) => {
  res.json({
    name: 'Accessibility Widget Complete',
    version: '2.0.0',
    features: [
      'Vision accessibility',
      'Cognitive support', 
      'Motor disabilities',
      'Senior-friendly',
      'ADHD-friendly',
      'Reading assistance'
    ],
    languages: ['de', 'en'],
    positions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    integration: {
      script: '/accessibility-widget-complete.js',
      shortUrl: '/widget.js',
      testPage: '/test'
    }
  });
});

// Dokumentations-Endpunkt
app.get('/docs', (req, res) => {
  const docsHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Widget Dokumentation</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
        .code { background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .highlight { background: #fffbf0; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>Accessibility Widget - Integrations-Dokumentation</h1>
    
    <h2>Schnelle Integration</h2>
    <div class="code">
&lt;script src="${req.protocol}://${req.get('host')}/accessibility-widget-complete.js"
        data-position="bottom-right"
        data-language="de"
        data-color="#0066cc"&gt;
&lt;/script&gt;
    </div>
    
    <h2>Konfigurationsoptionen</h2>
    <h3>Position</h3>
    <ul>
        <li><span class="highlight">bottom-right</span> (Standard)</li>
        <li><span class="highlight">bottom-left</span></li>
        <li><span class="highlight">top-right</span></li>
        <li><span class="highlight">top-left</span></li>
    </ul>
    
    <h3>Sprache</h3>
    <ul>
        <li><span class="highlight">de</span> - Deutsch (Standard)</li>
        <li><span class="highlight">en</span> - English</li>
    </ul>
    
    <h3>Farbe</h3>
    <div class="code">
data-color="#0066cc"  &lt;!-- Benutzerdefinierte Farbe --&gt;
data-color="red"      &lt;!-- CSS-Farbnamen --&gt;
data-color="rgb(255,0,0)" &lt;!-- RGB-Werte --&gt;
    </div>
    
    <h2>Kurze URLs</h2>
    <ul>
        <li><a href="/widget.js">/widget.js</a> - Kurze URL</li>
        <li><a href="/a11y.js">/a11y.js</a> - Noch kürzere URL</li>
    </ul>
    
    <h2>Test & API</h2>
    <ul>
        <li><a href="/test">Test-Seite</a> - Widget-Funktionalität testen</li>
        <li><a href="/api/widget-info">API Info</a> - Widget-Informationen</li>
    </ul>
    
    <h2>Support</h2>
    <p>Bei Fragen zur Integration kontaktieren Sie: support@brandingbrothers.de</p>
</body>
</html>`;
  
  res.send(docsHTML);
});

// Hauptseite mit Übersicht
app.get('/', (req, res) => {
  const indexHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Widget CDN</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            padding: 40px; 
            max-width: 900px; 
            margin: 0 auto; 
            background: #f8fafc;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .code { 
            background: #1a1a1a; 
            color: #00ff00; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 15px 0; 
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        .btn {
            display: inline-block;
            background: #0066cc;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            margin: 10px 10px 10px 0;
            font-weight: 600;
        }
        .btn:hover { background: #0052a3; }
        .feature-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .feature {
            background: #f0f9ff;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #0066cc;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Accessibility Widget CDN</h1>
        <p>Barrierefreiheits-Widget für jede Website - Einfache Integration mit einem Script-Tag.</p>
        
        <h2>Sofortige Integration</h2>
        <div class="code">
&lt;script src="${req.protocol}://${req.get('host')}/widget.js"
        data-position="bottom-right"
        data-language="de"&gt;
&lt;/script&gt;
        </div>
        
        <h2>Features</h2>
        <div class="feature-list">
            <div class="feature">
                <strong>6 Profile</strong><br>
                Vision, Kognitiv, Motor, Senior, ADHD, Lesen
            </div>
            <div class="feature">
                <strong>50+ Funktionen</strong><br>
                Kontrast, Textgröße, Links, Navigation
            </div>
            <div class="feature">
                <strong>Mehrsprachig</strong><br>
                Deutsch und Englisch
            </div>
            <div class="feature">
                <strong>Responsive</strong><br>
                Desktop, Tablet, Mobile
            </div>
        </div>
        
        <h2>Quick Links</h2>
        <a href="/test" class="btn">🧪 Widget Testen</a>
        <a href="/docs" class="btn">📚 Dokumentation</a>
        <a href="/widget.js" class="btn">⬇️ Widget Download</a>
        <a href="/api/widget-info" class="btn">📊 API Info</a>
        
        <h2>CDN URLs</h2>
        <div class="code">
# Vollständige URL:
${req.protocol}://${req.get('host')}/accessibility-widget-complete.js

# Kurze URLs:
${req.protocol}://${req.get('host')}/widget.js
${req.protocol}://${req.get('host')}/a11y.js
        </div>
        
        <h2>Unterstützung</h2>
        <p>📧 E-Mail: support@brandingbrothers.de<br>
        🌐 Website: brandingbrothers.de</p>
    </div>
</body>
</html>`;
  
  res.send(indexHTML);
});

// Server starten
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Widget CDN Server läuft auf Port ${PORT}`);
  console.log(`📱 Widget URL: http://localhost:${PORT}/widget.js`);
  console.log(`🧪 Test-Seite: http://localhost:${PORT}/test`);
  console.log(`📚 Dokumentation: http://localhost:${PORT}/docs`);
});

export default app;