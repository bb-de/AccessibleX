# Barrierefreiheits-Widget Implementierungsanleitung

Diese Dokumentation erklärt, wie das Barrierefreiheits-Widget korrekt implementiert und in jede Website integriert werden kann.

## Inhaltsverzeichnis

1. [Widget-Dateien und Struktur](#widget-dateien-und-struktur)
2. [Einfache Integration](#einfache-integration)
3. [Konfigurationsoptionen](#konfigurationsoptionen)
4. [Content Security Policy](#content-security-policy)
5. [Fehlerbehebung](#fehlerbehebung)
6. [Anpassungsmöglichkeiten](#anpassungsmöglichkeiten)

## Widget-Dateien und Struktur

Das Widget besteht aus folgenden Dateien:

- **widget-loader.js**: Hauptskript, das als einziges direkt in die Website eingebunden wird
- **widget-element.js**: Web Component Definition für vollständige DOM-Isolation
- **widget-styles.css**: Stilregeln für das Widget-Aussehen
- **widget-a11y-helpers.js**: Hilfsfunktionen für Barrierefreiheits-Anpassungen
- **widget-main.js**: Widget-Hauptfunktionalität

Alle Dateien müssen auf einem Webserver (z.B. via Vercel, Netlify, GitHub Pages) gehostet werden.

## Einfache Integration

Um das Widget in eine Website einzubinden, fügen Sie einfach das folgende Skript-Tag in den `<head>` oder am Ende des `<body>` ein:

```html
<script 
  src="https://deine-domain.com/widget-loader.js" 
  data-token="DEIN_API_TOKEN"
  data-position="right" 
  data-lang="de" 
  data-theme="default"
  async 
  defer
  crossorigin="anonymous">
</script>
```

Ersetzen Sie `https://deine-domain.com/widget-loader.js` mit der tatsächlichen URL, unter der das Widget-Loader-Skript gehostet wird.

## Konfigurationsoptionen

Das Widget kann über folgende Attribute angepasst werden:

| Attribut | Beschreibung | Mögliche Werte | Standard |
|----------|--------------|----------------|----------|
| `data-position` | Position des Widget-Buttons | `"right"`, `"left"` | `"right"` |
| `data-lang` | Sprache des Widgets | `"de"`, `"en"`, `"fr"`, `"es"` | `"de"` |
| `data-theme` | Farbschema des Widgets | `"default"`, `"dark"`, `"light"`, `"high-contrast"` | `"default"` |
| `data-token` | API-Token für Analyse und kundenspezifische Einstellungen | String | `""` |
| `data-debug` | Debug-Modus aktivieren | `"true"`, `"false"` | `"false"` |

## Content Security Policy

Wenn Ihre Website eine strikte Content Security Policy (CSP) verwendet, müssen Sie möglicherweise folgende Direktiven hinzufügen:

```
Content-Security-Policy: 
  script-src 'self' https://deine-domain.com;
  style-src 'self' https://deine-domain.com 'unsafe-inline';
  connect-src 'self' https://deine-domain.com;
  img-src 'self' https://deine-domain.com;
  font-src 'self' https://deine-domain.com;
```

## Fehlerbehebung

### Widget wird nicht angezeigt

1. Prüfen Sie, ob das Widget-Loader-Skript korrekt geladen wurde (Netzwerk-Tab in den Entwicklertools)
2. Prüfen Sie, ob JavaScript-Fehler auftreten (Konsole in den Entwicklertools)
3. Stellen Sie sicher, dass keine CSS-Regeln das Widget überdecken (z.B. durch z-index)

### Widget sieht falsch aus

1. Prüfen Sie, ob die Widget-Styles korrekt geladen wurden
2. Schauen Sie nach CSS-Konflikten mit der Website
3. Versuchen Sie ein anderes Theme mit `data-theme="dark"` oder `data-theme="high-contrast"`

### Widget funktioniert nicht richtig

1. Aktivieren Sie den Debug-Modus mit `data-debug="true"`
2. Prüfen Sie, ob alle Widget-Dateien verfügbar sind
3. Stellen Sie sicher, dass keine JavaScript-Fehler auftreten

## Anpassungsmöglichkeiten

### Eigenes Styling

Das Widget verwendet isolierte Stile durch Shadow DOM oder Präfixe, aber Sie können das Aussehen des Buttons anpassen:

```css
/* Diese Stile werden das Widget-Aussehen beeinflussen */
#a11y-widget-button, .a11y-widget-button {
  background-color: #ff6600 !important; /* Orangefarbener Button */
}
```

### JavaScript API

Das Widget stellt eine JavaScript-API zur Verfügung, die Sie nutzen können:

```javascript
// Widget manuell öffnen
if (window.A11yWidget) {
  window.A11yWidget.togglePanel();
}

// Widget manuell zurücksetzen
if (window.A11yWidget) {
  window.A11yWidget.resetSettings();
}

// Debug-Modus aktivieren
if (window.A11yWidget) {
  window.A11yWidget.debug(true);
}
```

### Events überwachen

Sie können auf Widget-Events reagieren:

```javascript
document.addEventListener('a11y-widget-ready', (e) => {
  console.log('Widget ist bereit');
});

document.addEventListener('a11y-widget-profile-applied', (e) => {
  console.log('Profil angewendet:', e.detail.profileId);
});
```

---

Bei weiteren Fragen oder Anpassungswünschen wenden Sie sich bitte an den Widget-Support.