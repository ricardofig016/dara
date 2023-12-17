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
