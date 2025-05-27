import express, { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { accessibilityAnalytics } from '../shared/schema';
import path from 'path';
import fs from 'fs';

/**
 * Setup Widget API routes for serving the accessibility widget to external sites
 */
export function setupWidgetRoutes(app: express.Express) {
  // Serve the widget Javascript file
  app.get('/widget/accessibility.js', (req: Request, res: Response) => {
    const widgetPath = path.join(__dirname, '../dist/widget-embed.js');
    
    try {
      if (fs.existsSync(widgetPath)) {
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'max-age=3600'); // 1 hour cache
        
        // Read and serve the widget script
        const widgetScript = fs.readFileSync(widgetPath, 'utf8');
        res.send(widgetScript);
      } else {
        console.error('Widget script not found at path:', widgetPath);
        res.status(404).send('Widget script not found');
      }
    } catch (error) {
      console.error('Error serving widget script:', error);
      res.status(500).send('Error serving widget script');
    }
  });
  
  // Widget iframe HTML page
  app.get('/widget-embed', (req: Request, res: Response) => {
    const { language = 'de', color = '#0055A4', tokenId = '' } = req.query;
    
    // Validate token ID
    if (!tokenId) {
      return res.status(403).send('Invalid access token');
    }
    
    // In a real implementation, you would validate the token against your database
    // Here we'll assume the token is valid for demonstration
    
    // Render the iframe HTML with the widget panel
    res.send(`
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accessibility Widget</title>
        <style>
          /* Base styles */
          body, html {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          /* Widget panel container */
          #accessibility-widget-panel {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
            width: 100%;
            height: 100%;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          }
          
          /* Widget styles here - this would include all your existing widget CSS */
          /* ... */
        </style>
      </head>
      <body>
        <div id="accessibility-widget-panel">
          <!-- Widget panel content would be rendered here -->
          <!-- In a production implementation, this would be your React widget -->
          <div style="padding: 1rem;">
            <h2 style="margin-top: 0;">Accessibility Settings</h2>
            
            <!-- Simplified widget interface for demonstration -->
            <div style="margin-bottom: 1rem;">
              <h3>Profiles</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <button class="profile-button" data-profile="visionImpaired">Vision Impaired</button>
                <button class="profile-button" data-profile="cognitiveDisability">Cognitive</button>
                <button class="profile-button" data-profile="senior">Senior</button>
                <button class="profile-button" data-profile="motorImpaired">Motor Impaired</button>
                <button class="profile-button" data-profile="adhdFriendly">ADHD</button>
                <button class="profile-button" data-profile="dyslexiaFriendly">Dyslexia</button>
                <button class="profile-button" data-profile="efficiencyMode">Efficiency</button>
                <button class="profile-button" data-profile="screenreaderMode">Screenreader</button>
              </div>
            </div>
            
            <div>
              <button id="reset-button">Reset All Settings</button>
              <button id="close-button">Close</button>
            </div>
          </div>
        </div>
        
        <script>
          // Simple widget implementation
          document.addEventListener('DOMContentLoaded', function() {
            // Profiles configuration
            const profiles = {
              visionImpaired: {
                textSize: 1,
                contrastMode: 'increased',
                fontFamily: 'readable',
                textAlign: 'left'
              },
              cognitiveDisability: {
                fontFamily: 'readable',
                lineHeight: 2,
                wordSpacing: 30,
                textAlign: 'left',
                highlightTitles: true
              },
              senior: {
                textSize: 2,
                contrastMode: 'increased',
                fontFamily: 'readable',
                highlightFocus: true,
                highlightLinks: true
              },
              motorImpaired: {
                keyboardNavigation: true,
                highlightFocus: true,
                customCursor: true,
                cursorSize: 'biggest',
                cursorColor: 'black'
              },
              adhdFriendly: {
                readingMask: true,
                hideImages: true,
                stopAnimations: true,
                highlightFocus: true
              },
              dyslexiaFriendly: {
                fontFamily: 'dyslexic',
                lineHeight: 2,
                wordSpacing: 50,
                letterSpacing: 1,
                textAlign: 'left'
              },
              efficiencyMode: {
                stopAnimations: true,
                darkMode: true,
                highlightLinks: true,
                highlightFocus: true,
                pageStructure: true
              },
              screenreaderMode: {
                keyboardNavigation: true,
                textToSpeech: true
              }
            };
            
            // Get elements
            const profileButtons = document.querySelectorAll('.profile-button');
            const resetButton = document.getElementById('reset-button');
            const closeButton = document.getElementById('close-button');
            
            // Setup communication with parent window
            window.parent.postMessage({
              type: 'accessibility-widget-ready'
            }, '*');
            
            // Handle profile button clicks
            profileButtons.forEach(button => {
              button.addEventListener('click', function() {
                const profileId = this.getAttribute('data-profile');
                const profileSettings = profiles[profileId];
                
                if (profileSettings) {
                  // Notify parent window of profile application
                  window.parent.postMessage({
                    type: 'accessibility-widget-profile-applied',
                    data: {
                      profileId,
                      profileSettings
                    }
                  }, '*');
                  
                  // Save analytics via API call
                  fetch('/api/widget/analytics/profile', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      tokenId: '${tokenId}',
                      profileId,
                      hostUrl: document.referrer
                    })
                  }).catch(err => console.error('Failed to log profile usage', err));
                }
              });
            });
            
            // Handle reset button
            resetButton.addEventListener('click', function() {
              window.parent.postMessage({
                type: 'accessibility-widget-reset'
              }, '*');
              
              // Save analytics
              fetch('/api/widget/analytics/reset', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  tokenId: '${tokenId}',
                  hostUrl: document.referrer
                })
              }).catch(err => console.error('Failed to log settings reset', err));
            });
            
            // Handle close button
            closeButton.addEventListener('click', function() {
              window.parent.postMessage({
                type: 'accessibility-widget-close'
              }, '*');
            });
            
            // Listen for messages from parent
            window.addEventListener('message', function(event) {
              const { type, isOpen } = event.data;
              
              if (type === 'accessibility-widget-toggle') {
                // Widget has been toggled open/closed in parent
                console.log('Widget toggled:', isOpen ? 'open' : 'closed');
              }
            });
          });
        </script>
      </body>
      </html>
    `);
  });
  
  // API endpoint for widget analytics
  app.post('/api/widget/analytics/profile', async (req: Request, res: Response) => {
    try {
      const { tokenId, profileId, hostUrl } = req.body;
      
      // Validate required fields
      if (!tokenId || !profileId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Record analytics event in database
      await db.insert(accessibilityAnalytics).values({
        sessionId: tokenId,
        event: 'profile-applied',
        data: {
          profileId,
          hostUrl,
          tokenId
        },
        userAgent: req.headers['user-agent'] || ''
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error recording widget analytics:', error);
      res.status(500).json({ error: 'Failed to record analytics' });
    }
  });
  
  app.post('/api/widget/analytics/reset', async (req: Request, res: Response) => {
    try {
      const { tokenId, hostUrl } = req.body;
      
      // Validate required fields
      if (!tokenId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Record analytics event in database
      await db.insert(accessibilityAnalytics).values({
        sessionId: tokenId,
        event: 'settings-reset',
        data: {
          hostUrl,
          tokenId
        },
        userAgent: req.headers['user-agent'] || ''
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error recording widget analytics:', error);
      res.status(500).json({ error: 'Failed to record analytics' });
    }
  });
  
  // API endpoint to register for a widget token
  app.post('/api/widget/register', async (req: Request, res: Response) => {
    try {
      const { domain, email, companyName } = req.body;
      
      // Validate required fields
      if (!domain || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Generate a unique token for this client
      const tokenId = generateToken();
      
      // In a real implementation, you would save this token to your database
      // associated with the client's information
      
      res.json({
        success: true,
        tokenId,
        instructions: 'Add the following script tag to your website:',
        scriptTag: `<script src="https://api.brandingbrothers.de/widget/accessibility.js" data-token-id="${tokenId}" data-language="de"></script>`
      });
    } catch (error) {
      console.error('Error registering widget:', error);
      res.status(500).json({ error: 'Failed to register widget' });
    }
  });
}

// Helper function to generate a random token
function generateToken(): string {
  return 'a' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}