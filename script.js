import Game from "./game.js";

let username = "";
let boardSize = "";
let piece = "";
let opponent = "";
let difficulty = "";
let firstToPlay = "";

const orangePiecePath = "assets/orange_piece.png";
const bluePiecePath = "assets/blue_piece.png";

function handleLogin(isGuest) {
  // Hide Login and display Options
  document.getElementById("login").style.display = "none";
  document.getElementById("options").style.display = "block";

  // Assign values to the variables
  username = document.getElementById("username").value;
  if (isGuest) {
    username = "guest";
  }
}

function displayLoginErrorMessage() {
  const errorMessage = document.getElementById("login-error-message");
  errorMessage.style.display = "block"; // Display the error message
}

function goToHome() {
  // Hide sections
  document.getElementById("options").style.display = "none";
  document.getElementById("game").style.display = "none";

  // Display Login
  document.getElementById("login").style.display = "block";

  // Clear error message and input boxes
  document.getElementById("login-error-message").style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function goToOptions() {
  // Hide other sections
  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "none";

  // Display options section
  document.getElementById("options").style.display = "block";
  resetOptions();
}

function togglePieceImage() {
  const pieceImage = document.getElementById("piece-image");

  if (!piece) {
    piece = orangePiecePath;
  }

  if (piece === orangePiecePath) {
    piece = bluePiecePath;
    pieceImage.src = bluePiecePath;
  } else {
    piece = orangePiecePath;
    pieceImage.src = orangePiecePath;
  }
}

function toggleDifficultyDiv() {
  const opponentSelect = document.getElementById("opponent");
  const difficultyDiv = document.getElementById("difficulty-div");

  if (opponentSelect.value === "computer") {
    difficultyDiv.style.display = "block";
  } else {
    difficultyDiv.style.display = "none";
  }
}

function resetOptions() {
  // Reset Piece Color
  if (piece === bluePiecePath) {
    togglePieceImage();
  }
  // Reset all selects to the first option
  document.getElementById("board-size").selectedIndex = 0;
  document.getElementById("opponent").selectedIndex = 0;
  document.getElementById("difficulty").selectedIndex = 0;
  document.getElementById("first-to-play").selectedIndex = 0;
  toggleDifficultyDiv();
}

function startGame() {
  // Get selected options
  boardSize = document.getElementById("board-size").value;
  opponent = document.getElementById("opponent").value;
  difficulty = document.getElementById("difficulty").value;
  firstToPlay = document.getElementById("first-to-play").value;

  // Hide the options and show the game section
  document.getElementById("options").style.display = "none";
  document.getElementById("game").style.display = "block";

  const game = new Game(boardSize, opponent, difficulty, firstToPlay);

  // Example for testing
  game.insertPiece(0, 0, "orange"); // Inserting an orange piece at (0, 0)
  game.movePiece(0, 0, 1, 0); // Moving the piece from (0, 0) to (1, 0)
  game.insertPiece(0, 0, "blue"); // Inserting a blue piece at (0, 0)
  //game.removePiece(1, 0); // Removing the piece at (1, 0)

  createGameElements(game);

  // Log options to the console
  console.log("Selected options: ", {
    username,
    boardSize,
    piece,
    opponent,
    difficulty,
    firstToPlay,
  });
}

function createGameElements(game) {
  // Get board element
  const boardDiv = document.getElementById("board");
  const boardStyles = window.getComputedStyle(boardDiv);
  const boardMaxWidth = boardStyles.getPropertyValue("max-width");

  // Compute correct cell size
  const cellSize = parseInt(boardMaxWidth) / game.cols - 6;

  // Clear previous content
  boardDiv.innerHTML = "";

  // Iterate through all cells
  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.cols; col++) {
      const cell = document.createElement("button");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.style.width = cellSize + "px";
      cell.style.height = cellSize + "px";

      // Change background-color of the cell based on parity
      if ((row + col) % 2 === 0) {
        cell.style.backgroundColor = "#fafafa";
      } else {
        cell.style.backgroundColor = "#cacaca";
      }

      // Add piece if exists
      if (game.board[row][col]) {
        const piece = document.createElement("img");
        piece.classList.add("piece");
        if (game.board[row][col].color === "orange") {
          piece.src = orangePiecePath;
        } else {
          piece.src = bluePiecePath;
        }
        cell.appendChild(piece);
      }

      // Append cell to board div
      boardDiv.appendChild(cell);
    }
  }
}

// ---------------------- NOT COMPLETED ----------------------
function showLeaderboard() {
  // Display popup
  document.getElementById("leaderboard-popup").style.display = "flex";

  // Get elements
  const closeButton = document.getElementById("leaderboard-popup-close");

  // Add an event listener to close the popup when the close button is clicked
  closeButton.addEventListener("click", () => {
    document.getElementById("leaderboard-popup").style.display = "none";
  });

  // Add an event listener to close the popup when ESCAPE is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.getElementById("leaderboard-popup").style.display = "none";
    }
  });
}

function showRules() {
  // Variable to keep track of the current section
  let currentSection = 1;

  // Display popup
  document.getElementById("rules-popup").style.display = "flex";

  // Get elements
  const closeButton = document.getElementById("rules-popup-close");
  const prevButton = document.getElementById("rules-prev-button");
  const nextButton = document.getElementById("rules-next-button");
  const rules = document.getElementById("rules");

  // Load rules from file
  let sections;
  fetch("rules.txt")
    .then((response) => response.text())
    .then((text) => {
      // Split the text into sections based on "[Section x]"
      sections = text.split(/\[Section \d+\]/);
      // Display the first section
      rules.innerHTML = sections[currentSection].trim();
    })
    .catch((error) => {
      console.error("Failed to fetch rules:", error);
      rules.innerText = "Failed to fetch rules.";
    });

  // Add an event listener to close the popup when the close button is clicked
  closeButton.addEventListener("click", () => {
    document.getElementById("rules-popup").style.display = "none";
  });

  // Add an event listener to close the popup when ESCAPE is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.getElementById("rules-popup").style.display = "none";
    }
  });

  // Event listener for "Previous" button
  prevButton.addEventListener("click", () => {
    if (currentSection > 1) {
      currentSection--;
      rules.innerHTML = sections[currentSection].trim();
    }
  });

  // Event listener for "Next" button
  nextButton.addEventListener("click", () => {
    if (currentSection < sections.length - 1) {
      currentSection++;
      rules.innerHTML = sections[currentSection].trim();
    }
  });

  // Add an event listener to move to the previous section when the left arrow key is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && sections && currentSection > 1) {
      currentSection--;
      rules.innerHTML = sections[currentSection].trim();
    }
  });

  // Add an event listener to move to the next section when the right arrow key is pressed
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "ArrowRight" &&
      sections &&
      currentSection < sections.length - 1
    ) {
      currentSection++;
      rules.innerHTML = sections[currentSection].trim();
    }
  });
}

// ---------------------- NOT COMPLETED ----------------------
function showSettings() {
  // Display popup
  document.getElementById("settings-popup").style.display = "flex";

  // Get elements
  const closeButton = document.getElementById("settings-popup-close");

  // Add an event listener to close the popup when the close button is clicked
  closeButton.addEventListener("click", () => {
    document.getElementById("settings-popup").style.display = "none";
  });

  // Add an event listener to close the popup when ESCAPE is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.getElementById("settings-popup").style.display = "none";
    }
  });
}

// Event listeners for buttons
document.getElementById("logo-button").addEventListener("click", goToHome);
document
  .getElementById("login-button")
  .addEventListener("click", displayLoginErrorMessage);
document
  .getElementById("play-as-guest-button")
  .addEventListener("click", () => {
    handleLogin(true);
  });
document
  .getElementById("piece-toggle-button")
  .addEventListener("click", togglePieceImage);
document
  .getElementById("reset-to-default-button")
  .addEventListener("click", resetOptions);
document
  .getElementById("start-game-button")
  .addEventListener("click", startGame);
for (const button of document.getElementsByClassName("home-screen-button")) {
  button.addEventListener("click", goToHome);
}
for (const button of document.getElementsByClassName("options-button")) {
  button.addEventListener("click", goToOptions);
}
for (const button of document.getElementsByClassName("leaderboard-button")) {
  button.addEventListener("click", showLeaderboard);
}
for (const button of document.getElementsByClassName("rules-button")) {
  button.addEventListener("click", showRules);
}
for (const button of document.getElementsByClassName("settings-button")) {
  button.addEventListener("click", showSettings);
}

// Event listener for the opponent dropdown
document
  .getElementById("opponent")
  .addEventListener("change", toggleDifficultyDiv);
