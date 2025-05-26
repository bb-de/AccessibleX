# Barrierefreiheits-Widget: Implementierungsanleitung

Diese Anleitung erklärt, wie du das Barrierefreiheits-Widget auf deiner Website einbinden kannst.

## 1. Dateien hochladen

Entpacke die Datei `accessibility-widget.zip` und lade die folgenden Dateien auf deinen Webserver hoch:

- `widget-main.js`
- `widget-a11y-helpers.js`
- `widget-styles.css`
- `widget-loader.js`

Du kannst die Dateien in einem beliebigen Verzeichnis auf deinem Server ablegen, z.B. in `/barrierefreiheit/` oder `/a11y-widget/`.

## 2. Widget einbinden

### Einfache Einbindung (empfohlen)

Füge diesen Code direkt vor dem schließenden `</body>`-Tag deiner HTML-Seite ein:

```html
<script src="https://deine-domain.de/pfad-zum-widget/widget-loader.js" 
    data-a11y-widget-init="true" 
    data-position="right" 
    data-language="de" 
    data-base-url="https://deine-domain.de/pfad-zum-widget/"></script>
```

Ersetze `https://deine-domain.de/pfad-zum-widget/` mit der tatsächlichen URL, unter der du die Widget-Dateien hochgeladen hast.

### Erweiterte Einbindung (für mehr Kontrolle)

Wenn du mehr Kontrolle über die Initialisierung des Widgets benötigst, kannst du es auch so einbinden:

```html
<script src="https://deine-domain.de/pfad-zum-widget/widget-loader.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    window.A11yWidgetLoader.load({
      position: 'right',
      language: 'de',
      baseUrl: 'https://deine-domain.de/pfad-zum-widget/',
      theme: 'default',
      token: 'dein-token', // Optional für Analytics
      apiEndpoint: 'https://deine-api.de' // Optional für Analytics
    });
  });
</script>
```

## 3. Konfigurationsoptionen

Das Widget bietet folgende Konfigurationsoptionen:

| Option | Mögliche Werte | Beschreibung |
|--------|---------------|-------------|
| `position` | `"right"`, `"left"` | Position des Widget-Buttons am unteren Bildschirmrand |
| `language` | `"de"`, `"en"` | Standardsprache des Widgets |
| `theme` | `"default"` | Design-Thema des Widgets (derzeit nur "default" verfügbar) |
| `token` | String | Token für Analytics-Funktionen (optional) |
| `apiEndpoint` | URL | Endpunkt für Analytics-Funktionen (optional) |
| `baseUrl` | URL | Pfad zu den Widget-Dateien |

## 4. Hosting-Optionen

Das Widget kann auf verschiedenen Plattformen gehostet werden:

### Eigener Webserver
Lade die Dateien in ein Verzeichnis auf deinem Webserver hoch.

### WordPress
Bei WordPress lädst du die Dateien in das `/wp-content/uploads/` oder ein anderes öffentlich zugängliches Verzeichnis hoch.

### GitHub Pages
1. Erstelle ein Repository für dein Widget
2. Lade die Widget-Dateien hoch
3. Aktiviere GitHub Pages für das Repository
4. Die Dateien sind dann unter `https://<dein-username>.github.io/<repository-name>/` verfügbar

### CDN (Content Delivery Network)
Du kannst die Dateien auch auf einem CDN wie Cloudflare, jsDelivr oder Vercel hosten, um die Ladezeiten zu verbessern.

## 5. Fehlerbehebung

Falls das Widget nicht wie erwartet funktioniert, überprüfe folgende Punkte:

1. Sind alle Dateien korrekt hochgeladen?
2. Ist der Pfad in `data-base-url` korrekt und endet mit einem `/`?
3. Haben die Dateien die richtigen Berechtigungen auf dem Server?
4. Gibt es JavaScript-Fehler in der Browser-Konsole?

## 6. Für Entwickler: API

Das Widget bietet eine JavaScript-API für fortgeschrittene Anwendungsfälle:

```javascript
// Widget programmatisch öffnen/schließen
window.A11yWidget.toggleWidget();

// Auf ein bestimmtes Profil umschalten
window.A11yWidget.applyProfile('visionImpaired');

// Sprache ändern
window.A11yWidget.setLanguage('en');

// Alle Einstellungen zurücksetzen
window.A11yWidget.resetSettings();

// Aktuelle Einstellungen abrufen
const settings = window.A11yWidget.getSettings();
```

---

Bei Fragen zur Implementation kontaktiere uns unter support@brandingbrothers.de