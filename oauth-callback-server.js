/**
 * OAuth Callback Server
 *
 * This simple HTTP server handles the OAuth redirect callback from Google.
 * Run this before authenticating: node oauth-callback-server.js
 *
 * It will listen on http://localhost:3000/oauth/callback
 * and display the authorization code for you to copy into Ghosted.
 */

const http = require('http')
const url = require('url')

const PORT = 3000

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)

  if (parsedUrl.pathname === '/oauth/callback') {
    const code = parsedUrl.query.code
    const error = parsedUrl.query.error

    if (error) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ghosted - OAuth Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            h1 { margin: 0 0 20px 0; font-size: 48px; }
            p { font-size: 18px; opacity: 0.9; }
            .error { color: #ff6b6b; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌</h1>
            <h2>Authentication Failed</h2>
            <p class="error">${error}</p>
            <p>You can close this window and try again.</p>
          </div>
        </body>
        </html>
      `)
      return
    }

    if (code) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ghosted - Authentication Successful</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
              max-width: 600px;
            }
            h1 { margin: 0 0 20px 0; font-size: 48px; }
            p { font-size: 18px; opacity: 0.9; margin: 10px 0; }
            .code-box {
              background: rgba(0, 0, 0, 0.3);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              word-break: break-all;
              font-family: 'Monaco', 'Courier New', monospace;
              font-size: 14px;
              position: relative;
            }
            .copy-btn {
              background: #007AFF;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              margin-top: 10px;
            }
            .copy-btn:hover {
              background: #0051D5;
            }
            .copy-btn:active {
              transform: scale(0.98);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅</h1>
            <h2>Authentication Successful!</h2>
            <p>Your authorization code:</p>
            <div class="code-box" id="code">${code}</div>
            <button class="copy-btn" onclick="copyCode()">Copy Code</button>
            <p style="margin-top: 20px; font-size: 14px; opacity: 0.7;">
              The code has been automatically sent to Ghosted.<br>
              You can close this window now.
            </p>
          </div>
          <script>
            function copyCode() {
              const code = document.getElementById('code').textContent;
              navigator.clipboard.writeText(code).then(() => {
                const btn = document.querySelector('.copy-btn');
                btn.textContent = 'Copied!';
                setTimeout(() => {
                  btn.textContent = 'Copy Code';
                }, 2000);
              });
            }

            // Auto-send code to Ghosted (if it's listening)
            window.addEventListener('DOMContentLoaded', () => {
              // Send message to Ghosted via custom protocol
              // This requires the app to handle ghosted:// URLs
              const code = document.getElementById('code').textContent;

              // Try to communicate back to the app
              fetch('http://localhost:3001/oauth-callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
              }).catch(() => {
                // Fallback: user will copy manually
                console.log('Could not auto-send code to Ghosted');
              });
            });
          </script>
        </body>
        </html>
      `)

      // Log to console
      console.log('\n✅ Authorization code received!')
      console.log('📋 Code:', code)
      console.log('\nYou can now use this code in Ghosted.\n')
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  }
})

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   👻 Ghosted OAuth Callback Server                   ║
║                                                       ║
║   Listening on: http://localhost:${PORT}              ║
║   Callback URL: http://localhost:${PORT}/oauth/callback  ║
║                                                       ║
║   Ready to receive OAuth callbacks from Google!      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `)
  console.log('Waiting for OAuth redirect...\n')
  console.log('Press Ctrl+C to stop the server.\n')
})

process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down OAuth callback server...')
  server.close()
  process.exit(0)
})
