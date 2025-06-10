import express, { Request, Response } from 'express';
import { accessibilityAnalytics } from '@shared/schema';
import { db } from './db';
import crypto from 'crypto';

/**
 * Widget API-Routen für externe Nutzung
 * Diese Routen werden für das Widget verwendet, wenn es auf einer externen Website eingebunden wird
 */
export function setupWidgetApiRoutes(app: express.Express) {
  // Öffentliche API-Routen für das Widget

  // Widget-Token validieren
  app.post('/api/widget/validate-token', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ 
          success: false, 
          message: 'Token is required' 
        });
      }

      // Hier würde in der Produktionsumgebung eine Validierung gegen die Datenbank erfolgen
      // Da dies eine Demo-Version ist, akzeptieren wir jeden Token
      res.json({ 
        success: true, 
        status: 'active',
        config: {
          allowAnalytics: true,
          theme: 'default',
          features: ['all']
        }
      });
    } catch (error) {
      console.error('Error validating token:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });

  // Widget-Nutzungsstatistiken speichern
  app.post('/api/widget/analytics', async (req: Request, res: Response) => {
    try {
      const { token, event, data, userAgent } = req.body;
      
      if (!token || !event) {
        return res.status(400).json({ 
          success: false, 
          message: 'Token and event are required' 
        });
      }
      
      // Eindeutige Session-ID für anonyme Nutzer
      const sessionId = req.session?.id || crypto.randomUUID();
      
      // Analytics-Event in der Datenbank speichern
      const [result] = await db.insert(accessibilityAnalytics).values({
        sessionId,
        event,
        data: data || {},
        userAgent: userAgent || req.headers['user-agent'] || null
      }).returning();
      
      res.json({ 
        success: true, 
        id: result.id
      });
    } catch (error) {
      console.error('Error saving analytics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });

  // Profil angewandt (separater Endpunkt für häufige Aktionen)
  app.post('/api/widget/analytics/profile-applied', async (req: Request, res: Response) => {
    try {
      const { token, profile, origin } = req.body;
      
      if (!token) {
        return res.status(400).json({ 
          success: false, 
          message: 'Token is required' 
        });
      }
      
      // Eindeutige Session-ID für anonyme Nutzer
      const sessionId = req.session?.id || crypto.randomUUID();
      
      // Analytics-Event in der Datenbank speichern
      const [result] = await db.insert(accessibilityAnalytics).values({
        sessionId,
        event: 'profile_applied',
        data: {
          profile: profile || 'unknown',
          origin: origin || req.headers.origin || 'unknown'
        },
        userAgent: req.headers['user-agent'] || null
      }).returning();
      
      res.json({ 
        success: true, 
        id: result.id
      });
    } catch (error) {
      console.error('Error saving profile analytics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });

  // Einstellungen zurückgesetzt (separater Endpunkt für häufige Aktionen)
  app.post('/api/widget/analytics/settings-reset', async (req: Request, res: Response) => {
    try {
      const { token, origin } = req.body;
      
      if (!token) {
        return res.status(400).json({ 
          success: false, 
          message: 'Token is required' 
        });
      }
      
      // Eindeutige Session-ID für anonyme Nutzer
      const sessionId = req.session?.id || crypto.randomUUID();
      
      // Analytics-Event in der Datenbank speichern
      const [result] = await db.insert(accessibilityAnalytics).values({
        sessionId,
        event: 'settings_reset',
        data: {
          origin: origin || req.headers.origin || 'unknown'
        },
        userAgent: req.headers['user-agent'] || null
      }).returning();
      
      res.json({ 
        success: true, 
        id: result.id
      });
    } catch (error) {
      console.error('Error saving reset analytics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });

  // Anzahl der Profile abrufen
  app.get('/api/widget/analytics/profile-count', async (req: Request, res: Response) => {
    try {
      // Profil-Nutzungsstatistiken aus der Datenbank abrufen
      // Für eine Demoversion liefern wir Beispieldaten
      const profiles = [
        { profile: 'visionImpaired', count: '423' },
        { profile: 'cognitiveDisability', count: '198' },
        { profile: 'senior', count: '321' },
        { profile: 'motorImpaired', count: '156' },
        { profile: 'adhdFriendly', count: '87' },
        { profile: 'dyslexiaFriendly', count: '65' },
        { profile: 'efficiencyMode', count: '134' },
        { profile: 'screenreaderMode', count: '92' }
      ];

      res.json({ 
        success: true, 
        profiles
      });
    } catch (error) {
      console.error('Error fetching profile counts:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });

  // Widget-Registrierung für neue Websites
  app.post('/api/widget/register', async (req: Request, res: Response) => {
    try {
      const { domain, email, companyName } = req.body;

      if (!domain || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Domain and email are required' 
        });
      }

      // In einer Produktivumgebung würden wir hier einen neuen Token generieren
      // und in der Datenbank speichern
      const tokenId = generateToken();

      // Demo-Antwort
      res.json({ 
        success: true, 
        tokenId,
        message: 'Widget successfully registered',
        scriptTag: `<script src="https://accessible-widget-vv-2-dobro-de.replit.app/widget/accessibility.js" data-token-id="${tokenId}" data-language="de"></script>`
      });
    } catch (error) {
      console.error('Error registering widget:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });

  // Widget-Nutzungsstatistiken abfragen
  app.get('/api/widget/analytics/summary', async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).json({ 
          success: false, 
          message: 'Token is required' 
        });
      }
      
      // In einer Produktivumgebung würden wir hier die Statistiken für den Token abfragen
      // Demo-Antwort
      res.json({ 
        success: true, 
        totalUsage: 1250,
        profileUsage: {
          visionImpaired: 423,
          cognitiveDisability: 198,
          senior: 321,
          motorImpaired: 156,
          adhdFriendly: 87,
          dyslexiaFriendly: 65
        },
        lastMonth: {
          usage: 345,
          growth: 12.5
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });
}

// Token für neue Widget-Registrierung generieren
function generateToken(): string {
  return 'a' + crypto.randomBytes(16).toString('hex');
}