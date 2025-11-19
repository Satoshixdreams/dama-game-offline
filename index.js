require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
// Offline mode: no blockchain formatting needed

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

async function testConnection() {
  console.log('Offline mode: blockchain connectivity disabled.');
  return true;
}

// API Routes
app.get('/', (req, res) => {
  res.redirect('/game')
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health endpoint accessed');
  res.json({ status: 'ok' });
});

// Token and balance endpoints removed (offline mode)

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/miniapp.json', (req, res) => {
  const ROOT_URL = process.env.ROOT_URL || `http://localhost:${process.env.PORT || 3001}`
  const config = {
    accountAssociation: {
      header: process.env.ACCOUNT_HEADER || "",
      payload: process.env.ACCOUNT_PAYLOAD || "",
      signature: process.env.ACCOUNT_SIGNATURE || ""
    },
    baseBuilder: { ownerAddress: process.env.OWNER_ADDRESS || "0x" },
    miniapp: {
      version: "1",
      name: "Dama",
      subtitle: "Turkish Draughts",
      description: "Play Turkish Draughts with AI or PvP",
      screenshotUrls: [`${ROOT_URL}/screenshot-portrait.svg`],
      iconUrl: `${ROOT_URL}/icon.svg`,
      splashImageUrl: `${ROOT_URL}/hero.svg`,
      splashBackgroundColor: "#000000",
      homeUrl: `${ROOT_URL}/game`,
      webhookUrl: `${ROOT_URL}/api/webhook`,
      primaryCategory: "games",
      tags: ["draughts", "checkers", "board", "ai"],
      heroImageUrl: `${ROOT_URL}/hero.svg`,
      tagline: "Play and strategize",
      ogTitle: "Dama – Turkish Draughts",
      ogDescription: "Classic Turkish Draughts with AI",
      ogImageUrl: `${ROOT_URL}/hero.svg`,
      noindex: true
    }
  }
  res.json(config)
})

app.get('/farcaster.json', (req, res) => {
  const ROOT_URL = process.env.ROOT_URL || `http://localhost:${process.env.PORT || 3001}`
  const config = {
    accountAssociation: {
      header: process.env.ACCOUNT_HEADER || "",
      payload: process.env.ACCOUNT_PAYLOAD || "",
      signature: process.env.ACCOUNT_SIGNATURE || ""
    },
    baseBuilder: { ownerAddress: process.env.OWNER_ADDRESS || "0x" },
    miniapp: {
      version: "1",
      name: "Dama",
      homeUrl: `${ROOT_URL}/game`,
      iconUrl: `${ROOT_URL}/icon.svg`,
      splashImageUrl: `${ROOT_URL}/hero.svg`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${ROOT_URL}/api/webhook`,
      subtitle: "Turkish Draughts",
      description: "Play Turkish Draughts with AI or PvP",
      screenshotUrls: [`${ROOT_URL}/screenshot-portrait.svg`],
      primaryCategory: "games",
      tags: ["draughts", "checkers", "board", "ai"],
      heroImageUrl: `${ROOT_URL}/hero.svg`,
      tagline: "Play and strategize",
      ogTitle: "Dama – Turkish Draughts",
      ogDescription: "Classic Turkish Draughts with AI",
      ogImageUrl: `${ROOT_URL}/hero.svg`,
      noindex: true
    }
  }
  res.json(config)
})

app.get('/.well-known/farcaster.json', (req, res) => {
  const ROOT_URL = process.env.ROOT_URL || `http://localhost:${process.env.PORT || 3001}`
  const config = {
    accountAssociation: {
      header: process.env.ACCOUNT_HEADER || "",
      payload: process.env.ACCOUNT_PAYLOAD || "",
      signature: process.env.ACCOUNT_SIGNATURE || ""
    },
    baseBuilder: { ownerAddress: process.env.OWNER_ADDRESS || "0x" },
    miniapp: {
      version: "1",
      name: "Dama",
      homeUrl: `${ROOT_URL}/game`,
      iconUrl: `${ROOT_URL}/icon.svg`,
      splashImageUrl: `${ROOT_URL}/hero.svg`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${ROOT_URL}/api/webhook`,
      subtitle: "Turkish Draughts",
      description: "Play Turkish Draughts with AI or PvP",
      screenshotUrls: [`${ROOT_URL}/screenshot-portrait.svg`],
      primaryCategory: "games",
      tags: ["draughts", "checkers", "board", "ai"],
      heroImageUrl: `${ROOT_URL}/hero.svg`,
      tagline: "Play and strategize",
      ogTitle: "Dama – Turkish Draughts",
      ogDescription: "Classic Turkish Draughts with AI",
      ogImageUrl: `${ROOT_URL}/hero.svg`,
      noindex: true
    }
  }
  res.json(config)
})

// Removed blockchain-related routes: /token-info, /symbol, /totalSupply, /balance

// Remove the first claim-rewards endpoint (around line 150-200)
// and keep only the one that uses the playerPointsDB

// Make sure these routes are defined BEFORE the catch-all route
// Database mock - in production, use a real database
const playerPointsDB = {};

// Add points endpoint
app.post('/add-points', async (req, res) => {
  console.log('Add points endpoint accessed');
  try {
    const { playerAddress, pointsToAdd } = req.body;
    
    if (!playerAddress || !pointsToAdd) {
      return res.status(400).json({ success: false, error: "Player id and points are required" });
    }
    if (typeof playerAddress !== 'string' || playerAddress.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Invalid player identifier" });
    }
    
    // Validate points
    if (isNaN(pointsToAdd) || pointsToAdd <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Points must be a positive number" 
      });
    }
    
    console.log(`Adding ${pointsToAdd} points for address: ${playerAddress}`);
    
    // Get current points (or initialize to 0)
    const currentPoints = playerPointsDB[playerAddress] || 0;
    
    // Add points
    playerPointsDB[playerAddress] = currentPoints + parseInt(pointsToAdd);
    
    res.json({ 
      success: true, 
      newTotalPoints: playerPointsDB[playerAddress]
    });
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to add points" 
    });
  }
});

// Get points endpoint
app.get('/get-points/:address', async (req, res) => {
  console.log('Get points endpoint accessed');
  try {
    const address = req.params.address;
    if (!address) {
      return res.status(400).json({ success: false, error: "Player id parameter is required" });
    }
    if (typeof address !== 'string' || address.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Invalid player identifier" });
    }
    
    console.log(`Fetching points for address: ${address}`);
    
    // Get current points (or return 0)
    const points = playerPointsDB[address] || 0;
    
    res.json({ 
      success: true, 
      points
    });
  } catch (error) {
    console.error('Error getting points:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get points" 
    });
  }
});

// Removed claim-rewards endpoint

app.post('/api/webhook', (req, res) => {
  res.json({ ok: true })
})

// THEN add the catch-all route
app.use((req, res) => {
  console.log(`Attempted to access undefined route: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Server is listening at http://localhost:${PORT}`);
  await testConnection();
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
