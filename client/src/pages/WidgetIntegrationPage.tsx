import React from 'react';
import { Helmet } from 'react-helmet';
import { LogoImage } from '@/components/accessibility/LogoImage';

export function WidgetIntegrationPage() {
  const [domain, setDomain] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [tokenId, setTokenId] = React.useState<string | null>(null);
  const [scriptTag, setScriptTag] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain || !email) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/widget/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          email,
          companyName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Es ist ein Fehler aufgetreten.');
      }
      
      setTokenId(data.tokenId);
      setScriptTag(data.scriptTag);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Es ist ein unbekannter Fehler aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCopyScript = () => {
    if (scriptTag) {
      navigator.clipboard.writeText(scriptTag)
        .then(() => {
          alert('Script-Tag in die Zwischenablage kopiert!');
        })
        .catch(err => {
          console.error('Fehler beim Kopieren:', err);
          alert('Fehler beim Kopieren. Bitte markieren und kopieren Sie den Code manuell.');
        });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Widget Integration - Accessibility Widget</title>
        <meta name="description" content="Integrieren Sie unser Barrierefreiheits-Widget in Ihre Website für mehr Zugänglichkeit." />
      </Helmet>
      
      <div className="flex justify-center mb-8">
        <LogoImage width={200} height={50} />
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-8">Widget für Ihre Website</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">So funktioniert es</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 font-bold text-xl mb-2">1. Registrieren</div>
            <p>Geben Sie Ihre Domain und Kontaktdaten ein, um Ihren persönlichen Zugangscode zu erhalten.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 font-bold text-xl mb-2">2. Einbinden</div>
            <p>Fügen Sie den generierten Script-Tag in den HTML-Code Ihrer Website ein.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 font-bold text-xl mb-2">3. Fertig!</div>
            <p>Das Barrierefreiheits-Widget erscheint automatisch auf Ihrer Website.</p>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Vorteile der Integration</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Verbesserte Barrierefreiheit für alle Besucher Ihrer Website</li>
          <li>Unterstützung für Menschen mit verschiedenen Behinderungen</li>
          <li>Einfache Integration ohne technisches Know-how</li>
          <li>Regelmäßige Updates und neue Funktionen</li>
          <li>Erfüllung von Barrierefreiheitsstandards</li>
          <li>Analytics zur Nutzung der Barrierefreiheitsfunktionen</li>
        </ul>
      </div>
      
      {!tokenId ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Jetzt registrieren</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                Website-Domain <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="domain"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="www.ihre-domain.de"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              />
              <p className="mt-1 text-sm text-gray-500">z.B. www.ihre-website.de (ohne https://)</p>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-Mail-Adresse <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="ihre-email@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Unternehmensname
              </label>
              <input
                type="text"
                id="companyName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ihr Unternehmen GmbH"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Wird verarbeitet...' : 'Widget-Zugang anfordern'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-2">✅ Registrierung erfolgreich!</h3>
            <p>Ihr Widget ist jetzt einsatzbereit. Folgen Sie den Schritten unten, um es in Ihre Website einzubinden.</p>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Ihre Widget-Integration</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Ihr persönlicher Zugangscode:</h3>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">{tokenId}</div>
            <p className="mt-1 text-sm text-gray-500">Bewahren Sie diesen Code sicher auf. Er ist einzigartig für Ihre Website.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Fügen Sie diesen Code vor dem schließenden &lt;/body&gt;-Tag Ihrer Webseite ein:</h3>
            <div className="relative">
              <pre className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                {scriptTag}
              </pre>
              <button
                onClick={handleCopyScript}
                className="absolute top-2 right-2 bg-blue-600 text-white py-1 px-2 rounded-md text-xs"
              >
                Kopieren
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-2">Anpassungsoptionen</h3>
            <p className="mb-2">Sie können das Widget an Ihre Bedürfnisse anpassen, indem Sie dem Script-Tag zusätzliche Datenattribute hinzufügen:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><code className="bg-gray-100 px-1">data-position="bottom-right"</code> - Position (bottom-right, bottom-left, top-right, top-left)</li>
              <li><code className="bg-gray-100 px-1">data-language="de"</code> - Sprache (de, en, fr, es)</li>
              <li><code className="bg-gray-100 px-1">data-color="#0055A4"</code> - Primärfarbe des Widgets</li>
            </ul>
          </div>
          
          <h3 className="font-medium text-gray-700 mb-2">Nächste Schritte:</h3>
          <ol className="list-decimal pl-6 space-y-2 mb-6">
            <li>Kopieren Sie den obigen Code.</li>
            <li>Fügen Sie ihn in Ihre Website ein, idealerweise direkt vor dem schließenden &lt;/body&gt;-Tag.</li>
            <li>Speichern und veröffentlichen Sie Ihre Änderungen.</li>
            <li>Überprüfen Sie Ihre Website - das Barrierefreiheits-Symbol sollte nun angezeigt werden.</li>
          </ol>
          
          <div className="text-center">
            <button
              onClick={() => {
                setTokenId(null);
                setScriptTag(null);
                setDomain('');
                setEmail('');
                setCompanyName('');
              }}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Zurück zum Anmeldeformular
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Bei Fragen zur Integration kontaktieren Sie uns unter <a href="mailto:support@brandingbrothers.de" className="text-blue-600 hover:underline">support@brandingbrothers.de</a></p>
      </div>
    </div>
  );
}
