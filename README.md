# Barrierefreiheit-Widget

Ein umfassendes Web-Accessibility-Widget zur Integration in beliebige Webseiten über ein einfaches Script-Tag.

## Hauptfunktionen

- **Sofort einsatzbereit**: Integration mit nur einem Script-Tag
- **Umfassende Barrierefreiheits-Profile**: Vordefinierte Profile für verschiedene Bedürfnisse (Sehbehinderung, kognitive Einschränkungen, motorische Beeinträchtigung, ADHS-freundlich, Legasthenie-freundlich, Senioren, Effizienz-Modus, Screenreader-Modus)
- **Individuell anpassbar**: Detaillierte Einstellungen für Text, Farben, Navigation und mehr
- **Mehrsprachig**: Unterstützung für Deutsch, Englisch, Französisch und Spanisch
- **Leicht zu implementieren**: Einfache Integration in bestehende Websites
- **Externe Hosting-Lösung**: Über GitHub, Vercel und Neon-Datenbank

## Struktur des Projekts

- **Client**: Frontend-Komponenten für das Widget
- **Server**: Backend-API für Widget-Verteilung und Analytik
- **Shared**: Gemeinsam genutzte Datenmodelle und Schemas
- **Public**: Statische Dateien für das externe Widget

## Technologie-Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Datenbank**: PostgreSQL (Neon)
- **Build-Tools**: Vite, ESBuild
- **Hosting**: Vercel

## Integration auf externen Webseiten

```html
<script 
  src="https://your-widget-url.vercel.app/widget-loader.js" 
  data-token="YOUR_TOKEN" 
  data-position="right" 
  data-lang="de"
  async
></script>
```

## Verfügbare Konfigurationsoptionen

| Attribut | Beschreibung | Mögliche Werte | Standard |
|----------|--------------|----------------|----------|
| data-token | Eindeutiger Zugriffstoken | String | (erforderlich) |
| data-position | Position des Widget-Buttons | "left", "right" | "right" |
| data-lang | Sprache der Widget-Oberfläche | "de", "en", "fr", "es" | "de" |
| data-theme | Design-Variante | "default", "dark", "light" | "default" |

## Deployment

Das Widget wird auf Vercel deployt und nutzt Neon als PostgreSQL-Datenbank für Nutzungsstatistiken und Einstellungen.

1. GitHub-Repository erstellen und Code hochladen
2. Vercel-Projekt verbinden
3. Umgebungsvariablen für Datenbankverbindung einrichten
4. Deployen und Widget-Loader-URL erhalten

## Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Datenbankschema aktualisieren
npm run db:push
```

## Autoren

- [BrandingBrothers](https://brandingbrothers.de)

## Lizenz

Copyright © 2025 BrandingBrothers