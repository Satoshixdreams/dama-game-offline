require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const zlib = require('zlib');
// Offline mode: no blockchain formatting needed

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

async function testConnection() {
  console.log('Offline mode: blockchain connectivity disabled.');
  return true;
}

function rootUrl(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'http').split(',')[0];
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return process.env.ROOT_URL || `${proto}://${host}`;
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  c = ~c;
  const out = Buffer.allocUnsafe(4);
  out.writeUInt32BE(c >>> 0, 0);
  return out;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length, 0);
  const crc = crc32(Buffer.concat([t, data]));
  return Buffer.concat([len, t, data, crc]);
}

function generatePng(width, height, r, g, b) {
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(2, 9);
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const line = Buffer.allocUnsafe(1 + width * 3);
  line[0] = 0;
  for (let i = 1; i < line.length; i += 3) { line[i] = r; line[i+1] = g; line[i+2] = b; }
  const raw = Buffer.allocUnsafe((1 + width * 3) * height);
  for (let y = 0; y < height; y++) line.copy(raw, y * line.length);
  const idat = zlib.deflateSync(raw);
  const chunks = [pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))];
  return Buffer.concat([sig, ...chunks]);
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

app.get('/icon.png', (req, res) => {
  const png = generatePng(1024, 1024, 20, 12, 12);
  res.set('Content-Type', 'image/png');
  res.send(png);
})

app.get('/splash.png', (req, res) => {
  const png = generatePng(1200, 630, 32, 24, 24);
  res.set('Content-Type', 'image/png');
  res.send(png);
})

app.get('/image.png', (req, res) => {
  const png = generatePng(1200, 630, 32, 24, 24);
  res.set('Content-Type', 'image/png');
  res.send(png);
})

app.get('/miniapp.json', (req, res) => {
  const ROOT_URL = rootUrl(req)
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
      iconUrl: `${ROOT_URL}/icon.png`,
      splashImageUrl: `${ROOT_URL}/splash.png`,
      splashBackgroundColor: "#000000",
      homeUrl: `${ROOT_URL}/game`,
      webhookUrl: `${ROOT_URL}/api/webhook`,
      primaryCategory: "games",
      tags: ["draughts", "checkers", "board", "ai"],
      heroImageUrl: `${ROOT_URL}/image.png`,
      tagline: "Play and strategize",
      ogTitle: "Dama – Turkish Draughts",
      ogDescription: "Classic Turkish Draughts with AI",
      ogImageUrl: `${ROOT_URL}/image.png`,
      noindex: true
    }
  }
  res.set('Cache-Control', 'no-store')
  res.json(config)
})

app.get('/farcaster.json', (req, res) => {
  const ROOT_URL = rootUrl(req)
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
      iconUrl: `${ROOT_URL}/icon.png`,
      splashImageUrl: `${ROOT_URL}/splash.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${ROOT_URL}/api/webhook`,
      subtitle: "Turkish Draughts",
      description: "Play Turkish Draughts with AI or PvP",
      screenshotUrls: [`${ROOT_URL}/screenshot-portrait.svg`],
      primaryCategory: "games",
      tags: ["draughts", "checkers", "board", "ai"],
      heroImageUrl: `${ROOT_URL}/image.png`,
      tagline: "Play and strategize",
      ogTitle: "Dama – Turkish Draughts",
      ogDescription: "Classic Turkish Draughts with AI",
      ogImageUrl: `${ROOT_URL}/image.png`,
      noindex: true
    }
  }
  res.set('Cache-Control', 'no-store')
  res.json(config)
})

app.get('/.well-known/farcaster.json', (req, res) => {
  const hosted = process.env.HOSTED_MANIFEST_URL
  if (hosted && hosted.startsWith('http')) {
    return res.redirect(307, hosted)
  }
  const ROOT_URL = rootUrl(req)
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
      iconUrl: `${ROOT_URL}/icon.png`,
      splashImageUrl: `${ROOT_URL}/splash.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${ROOT_URL}/api/webhook`,
      subtitle: "Turkish Draughts",
      description: "Play Turkish Draughts with AI or PvP",
      screenshotUrls: [`${ROOT_URL}/screenshot-portrait.svg`],
      primaryCategory: "games",
      tags: ["draughts", "checkers", "board", "ai"],
      heroImageUrl: `${ROOT_URL}/image.png`,
      tagline: "Play and strategize",
      ogTitle: "Dama – Turkish Draughts",
      ogDescription: "Classic Turkish Draughts with AI",
      ogImageUrl: `${ROOT_URL}/image.png`,
      noindex: true
    }
  }
  res.set('Cache-Control', 'no-store')
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
