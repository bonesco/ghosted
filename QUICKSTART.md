# 🚀 Quick Start Guide

Get Ghosted up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Google OAuth Credentials

### 2.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Ghosted" and click "Create"

### 2.2 Enable Gmail API

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Gmail API"
3. Click on it and press **Enable**

### 2.3 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - Choose "External" (or "Internal" if you have Google Workspace)
   - Fill in app name: "Ghosted"
   - Add your email as support and developer contact
   - Click "Save and Continue"
   - On Scopes page, click "Add or Remove Scopes"
   - Add these scopes:
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/gmail.modify`
     - `https://mail.google.com/`
   - Click "Update" then "Save and Continue"
   - Add yourself as a test user (use your Gmail address)
   - Click "Save and Continue"
4. Back on Credentials page, click **Create Credentials** → **OAuth client ID**
5. Choose application type: **Desktop app**
6. Name: "Ghosted Desktop"
7. Click **Create**
8. **Important**: Copy your Client ID and Client Secret (you'll need these!)

## Step 3: Start the OAuth Callback Server

In a new terminal, run:

```bash
npm run oauth-server
```

Leave this running - it will catch the OAuth redirect from Google.

## Step 4: Start Ghosted

In another terminal:

```bash
npm run dev
```

## Step 5: Configure OAuth in Ghosted

1. When Ghosted opens, press `⌘,` to open Settings
2. Go to the **OAuth Setup** tab
3. Paste your **Client ID** and **Client Secret**
4. Click **Save Credentials**
5. Close Settings (press `ESC`)

## Step 6: Connect Your Gmail

1. Click **Connect Gmail Account**
2. Your browser will open with Google sign-in
3. Sign in with your Gmail account
4. Grant the requested permissions
5. You'll be redirected to the callback server
6. The authorization code will be displayed
7. Copy the code (it should auto-send to Ghosted)
8. If needed, paste it back in Ghosted

## Step 7: Start Using Ghosted!

That's it! You should now see your inbox. Try these shortcuts:

- `⌘⇧E` - Show/hide Ghosted (works globally!)
- `↑` `↓` - Navigate emails
- `Enter` - Open email
- `1`-`9` - Quick jump to email
- `/` - Search
- `⌘,` - Settings

## Troubleshooting

### "OAuth credentials not configured"

Make sure you completed Step 5 and saved your credentials.

### "Failed to load emails"

- Check that Gmail API is enabled in Google Cloud Console
- Make sure you added the correct OAuth scopes
- Try disconnecting and reconnecting your account

### OAuth callback doesn't work

- Make sure the callback server is running (`npm run oauth-server`)
- Check that you're using `http://localhost:3000/oauth/callback` as your redirect URI
- For Desktop app OAuth type, you don't need to add this to Google Cloud Console

### Global hotkey doesn't work

Another app might be using `⌘⇧E`. Check Console for errors.

## Next Steps

- Read the full [README.md](README.md) for more details
- Check out all [keyboard shortcuts](README.md#-keyboard-shortcuts)
- Star the repo on GitHub if you like it!

---

Need help? [Open an issue](https://github.com/yourusername/ghosted/issues) on GitHub.
