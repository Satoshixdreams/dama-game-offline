# Turkish Draughts (Dama) — Offline Game

A lightweight implementation of Turkish Draughts (Dama) with a Node/Express server and a vanilla HTML/JS UI. Runs completely offline with an AI bot option.

## Overview
- Board: 8×8
- Pieces: Men and Kings for two players
- Movement: Orthogonal (up/down/left/right)
- Capture: Orthogonal jump over an adjacent opponent piece to the next empty square
- Mandatory rule: If capture is possible, you must capture; if multiple capture sequences exist, the one that captures the maximum number of pieces is mandatory
- Promotion: A man becomes a king on reaching the far rank; there is also an automatic kinging when a side has only one piece left
- Modes: Player vs Player (PvP) and Player vs Bot (AI)

## How to Run
1. Install dependencies
   - `npm install`
2. Start the server
   - `npm start`
3. Open the game UI
   - Visit `http://localhost:3001/game`

## Controls
- Select a piece by clicking it; legal destination squares are highlighted
- If a capture exists, only capture moves are allowed
- When multiple capture sequences exist, the UI enforces choosing the sequence with the highest number of captures
- Click the destination square to make the move; multistep captures proceed sequentially
- Use the “New Game” button to reset
- Select mode from the dropdown:
  - `Player vs Player (PvP)`
  - `Player vx Bot (Ai)`

## Rules Implemented
- Men movement
  - Orthogonal one square: forward (towards the opponent’s side) or sideways (left/right)
  - No backward movement for men
- Men capture
  - Orthogonal jump over an adjacent opponent piece into the next empty square beyond
  - Multiple captures are supported via sequences when possible
- Kings movement
  - Orthogonal any number of empty squares
- Kings capture
  - Orthogonal jump over the first opponent piece encountered in a line and land on any empty square beyond
- Mandatory capture
  - If any capture exists, a player must capture
  - If multiple capture sequences exist, the sequence with the maximum number of captured pieces is mandatory
- Promotion
  - A man is promoted to king when it reaches the far rank
  - Additional rule: if a side has only one piece remaining, that piece is automatically converted to a king
- End of game
  - A player wins when the opponent has no pieces or no legal moves
  - Draw condition when both sides have only kings and no progress is possible (implemented as a simple both‑kings state check)

## Status Messages
- The status bar at the top indicates whose turn it is
- When the bot is thinking, it shows “Computer is thinking...”
- During multi-capture, prompts like “Continue capture...” or “Computer continues capture...” appear

## AI Bot
- The AI uses a simple search over available moves with a preference for higher captures
- Depth and heuristics are minimal to keep gameplay responsive

## Project Structure
- `index.js` — Node/Express server, serves the game UI and health endpoint
- `index.html` — Game UI, board rendering, move logic, AI, and status display
- `package.json` — Scripts and dependencies
- `render.yaml` — Example service config for Node deployment

## Notes
- The game runs entirely offline; there is no blockchain or wallet integration
- Points displayed in the UI increase by 1 per capture and are purely visual

## License
This project is provided as-is. See `SECURITY.md` for security policy placeholders.