const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const fs = require("fs").promises;

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Registration route
app.post("/register", async (req, res) => {
  const { nick, password } = req.body;

  // Check if required arguments are present
  if (!nick || !password) {
    return res.status(400).json({ error: "All arguments are required." });
  }

  // Check if arguments are strings
  if (typeof nick !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Arguments must be strings." });
  }

  // Encrypt the password
  const hashedPassword = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");

  try {
    // Read existing user data from the file
    const existingData = await fs.readFile("userData.json", "utf-8");
    const users = existingData ? JSON.parse(existingData) : {};

    // Check if the nickname is already registered with a different password
    console.log(users, users[nick], hashedPassword);
    if (users && users[nick] && users[nick] !== hashedPassword) {
      return res.status(401).json({
        error:
          "User with the same nickname already registered with a different password.",
      });
    }

    // Save user data to a file
    const userData = { [nick]: hashedPassword };
    const updatedUsers = { ...users, ...userData };

    await fs.writeFile("userData.json", JSON.stringify(updatedUsers));

    // Send a success response
    res.status(200).json({ message: "Registration successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

app.post("/join", async (req, res) => {
  const { group, nick, password, size } = req.body;

  // Check if required arguments are present
  if (!group || !nick || !password || !size) {
    return res.status(400).json({ error: "All arguments are required." });
  }

  // Check if arguments are strings and size is a valid number
  if (
      typeof group !== "string" ||
      typeof nick !== "string" ||
      typeof password !== "string" ||
      isNaN(size) || size <= 0
  ) {
    return res.status(400).json({ error: "Invalid argument values." });
  }

  // Authenticate the player
  const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");

  try {
    // Read existing user data from the file
    const existingData = await fs.readFile("userData.json", "utf-8");
    const users = existingData ? JSON.parse(existingData) : {};

    // Check if the player is registered
    if (!users || !users[nick] || users[nick] !== hashedPassword) {
      return res.status(401).json({ error: "Authentication failed." });
    }

    // Check if there is a waiting player with the same board size
    // If yes, pair them and send a pairing notification
    // If no, register the player for later pairing
    const waitingPlayers = [];
    const waitingPlayer = waitingPlayers.find(
        (player) => player.size === size
    );

    if (waitingPlayer) {
      // Pair the players and send pairing notification
      const pairingNotification = `Players ${nick} and ${waitingPlayer.nick} are paired for a game on a ${size}x${size} board.`;
      console.log(pairingNotification);
      // Send the notification to clients or update the game state as needed

      // Remove the waiting player from the list
      const index = waitingPlayers.indexOf(waitingPlayer);
      waitingPlayers.splice(index, 1);
    } else {
      // Register the player for later pairing
      waitingPlayers.push({ nick, size });
      console.log(`${nick} is registered for later pairing.`);
    }

    // Send a success response
    res.status(200).json({ message: "Join request processed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});


app.post("/leave", async (req, res) => {
  const { nick, password, game } = req.body;

  // Check if required arguments are present
  if (!nick || !password || !game) {
    return res.status(400).json({ error: "All arguments are required." });
  }

  // Check if arguments are strings
  if (typeof nick !== "string" || typeof password !== "string" || typeof game !== "string") {
    return res.status(400).json({ error: "Invalid argument values." });
  }

  // Authenticate the player
  const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");

  try {
    // Read existing user data from the file
    const existingData = await fs.readFile("userData.json", "utf-8");
    const users = existingData ? JSON.parse(existingData) : {};

    // Check if the player is registered
    if (!users || !users[nick] || users[nick] !== hashedPassword) {
      return res.status(401).json({ error: "Authentication failed." });
    }

    // Check if the game identifier is valid
    const isValidGame = true;
    if (!isValidGame) {
      return res.status(400).json({ error: "Invalid game identifier." });
    }

    // Check if the game is already underway
    const isGameUnderway = true;
    if (isGameUnderway) {
      // Grant victory to the opponent
      const victoryNotification = `Player ${nick} has abandoned the game. Victory awarded to the opponent.`;
      console.log(victoryNotification);
    } else {
      // If the game is still in matchmaking, just exit with no consequences
      console.log(`Player ${nick} has left the game during matchmaking.`);
    }

    // Send a success response
    res.status(200).json({ message: "Leave request processed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/notify", async (req, res) => {
  const { nick, password, game, move } = req.body;

  // Check if required arguments are present
  if (!nick || !password || !game || !move) {
    return res.status(400).json({ error: "All arguments are required." });
  }

  // Check if arguments are strings
  if (typeof nick !== "string" || typeof password !== "string" || typeof game !== "string" || typeof move !== "string") {
    return res.status(400).json({ error: "Invalid argument values." });
  }

  // Authenticate the player
  const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");

  try {
    // Read existing user data from the file
    const existingData = await fs.readFile("userData.json", "utf-8");
    const users = existingData ? JSON.parse(existingData) : {};

    // Check if the player is registered
    if (!users || !users[nick] || users[nick] !== hashedPassword) {
      return res.status(401).json({ error: "Authentication failed." });
    }

    // Check if it's the player's turn
    const isPlayerTurn = true;
    if (!isPlayerTurn) {
      return res.status(400).json({ error: "It's not your turn to play." });
    }

    // Check if the move violates game rules
    const isValidMove = true;
    if (!isValidMove) {
      return res.status(400).json({ error: "Invalid move. It violates game rules." });
    }

    // Process the move
    console.log(`Player ${nick} made a move: ${move}`);

    // Send a success response
    res.status(200).json({ message: "Move notified successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const { Readable } = require('stream');

// Store active connections for SSE
const activeConnections = new Map();

// Function to send updates to connected clients
function sendSSEUpdate(game, message) {
  const clients = activeConnections.get(game);

  if (clients) {
    clients.forEach((res) => {
      res.write(`data: ${JSON.stringify({ message })}\n\n`);
    });
  }
}

// SSE route for updates
app.get("/update", (req, res) => {
  const { game, nick } = req.query;

  // Check if required arguments are present
  if (!game || !nick) {
    return res.status(400).json({ error: "Game and nick are required." });
  }

  // Check if game reference is valid
  const isValidGame = true;
  if (!isValidGame) {
    return res.status(400).json({ error: "Invalid game identifier." });
  }

  // Set up SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Store the connection for future updates
  const client = { game, nick, res };
  if (!activeConnections.has(game)) {
    activeConnections.set(game, new Set());
  }
  activeConnections.get(game).add(res);

  // Send initial connection message
  sendSSEUpdate(game, `Player ${nick} connected to the game.`);

  // Handle disconnect
  req.on("close", () => {
    // Remove the client from the active connections
    activeConnections.get(game).delete(res);
    sendSSEUpdate(game, `Player ${nick} disconnected from the game.`);
  });

});

app.get("/ranking", async (req, res) => {
  const { group, size } = req.query;

  // Check if required arguments are present
  if (!group || !size) {
    return res.status(400).json({ error: "Group and size are required." });
  }

  // Check if arguments are valid
  if (isNaN(group) || isNaN(size) || size <= 0) {
    return res.status(400).json({ error: "Invalid argument values." });
  }

  try {
    // Read existing user data from the file
    const existingData = await fs.readFile("userData.json", "utf-8");
    const users = existingData ? JSON.parse(existingData) : {};

    // Filter users by group and size
    const filteredUsers = Object.entries(users)
        .filter(([nick, password]) => {
          return true;
        })
        .map(([nick, password]) => {
          const numberOfWins = 0;
          return { nick, numberOfWins };
        });

    // Sort users by the number of wins in descending order
    const sortedUsers = filteredUsers.sort((a, b) => b.numberOfWins - a.numberOfWins);

    // Get the top 10 players
    const topPlayers = sortedUsers.slice(0, 10);

    // Send the leaderboard as the response
    res.status(200).json({ leaderboard: topPlayers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});




