# Barrierefreiheit-Widget - Installations- und Integrationsanleitung

## Übersicht

Das Barrierefreiheit-Widget ist eine leistungsstarke Lösung, die es Besuchern ermöglicht, Webseiten an ihre individuellen Barrierefreiheits-Bedürfnisse anzupassen. Die Integration ist einfach und erfordert nur einen einzelnen Script-Tag auf Ihrer Website.

## Schnellstart

Fügen Sie den folgenden Code direkt vor dem schließenden `</body>`-Tag Ihrer Website ein:

```html
<script 
  src="https://your-widget-url.vercel.app/widget-loader.js" 
  data-token="DEIN_TOKEN" 
  data-position="right" 
  data-lang="de"
  async
></script>
```

## Konfigurationsoptionen

Das Widget kann über folgende Datenattribute konfiguriert werden:

| Attribut | Beschreibung | Mögliche Werte | Standard |
|----------|--------------|----------------|----------|
| data-token | Ihr eindeutiger Zugriffstoken | String | (erforderlich) |
| data-position | Position des Widget-Buttons | "left", "right" | "right" |
| data-lang | Sprache der Widget-Oberfläche | "de", "en", "fr", "es" | "de" |
| data-theme | Design-Variante | "default", "dark", "light" | "default" |

## Technische Details

Das Widget wird extern gehostet und von deiner Website aus über unsere API angesprochen. Alle benötigten Ressourcen (JavaScript, CSS, Bilder) werden automatisch geladen.

### Wie es funktioniert:

1. Der `widget-loader.js` wird als einzige Ressource direkt von Ihrer Website geladen
2. Der Loader erstellt einen Widget-Container und lädt die notwendigen Ressourcen (CSS, Hauptskript)
3. Das Widget wird initialisiert und ist für Ihre Besucher sofort nutzbar
4. Nutzerpräferenzen werden (optional) in der Datenbank gespeichert

### Technologie-Stack:

- Frontend: JavaScript, CSS
- Backend: Node.js, Express
- Datenbank: PostgreSQL (gehostet auf Neon)
- Hosting: Vercel
- Quellcode-Verwaltung: GitHub

## Datenschutz

Das Widget sammelt anonyme Nutzungsdaten, um die Funktionalität zu verbessern. Es werden keine personenbezogenen Daten gespeichert, es sei denn, der Nutzer hat explizit zugestimmt.

## Häufige Fragen

**F: Wie erhalte ich einen Token?**
A: Kontaktiere uns unter [kontakt@brandingbrothers.de](mailto:kontakt@brandingbrothers.de) für einen individuellen Token.

**F: Beeinflusst das Widget die Ladegeschwindigkeit meiner Website?**
A: Nein, das Widget wird asynchron geladen und blockiert nicht das Rendern der Seite.

**F: Kann ich das Design an meine Website anpassen?**
A: Ja, wir bieten verschiedene Themes und können auch individuelle Anpassungen vornehmen.

## Support

Bei Fragen oder Problemen kontaktieren Sie uns unter:
- E-Mail: [support@brandingbrothers.de](mailto:support@brandingbrothers.de)
- Telefon: +49 123 456789

---

© 2025 BrandingBrothers | [brandingbrothers.de](https://brandingbrothers.de)