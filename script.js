let username = "";
let boardSize = "";
let piece = "";
let opponent = "";
let difficulty = "";
let firstToPlay = "";

function handleLogin() {
  // Hide Login and display Options
  document.getElementById("login").style.display = "none";
  document.getElementById("options").style.display = "block";

  // Assign values to the variables
  username = document.getElementById("username").value;
  if (!username) {
    username = "guest";
  }
}

function displayLoginErrorMessage() {
  const errorMessage = document.getElementById("login-error-message");
  errorMessage.style.display = "block"; // Display the error message
}

function goToHome() {
  document.getElementById("options").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("login-error-message").style.display = "none";
}

function togglePieceImage() {
  const pieceImage = document.getElementById("piece-image");

  if (!piece) {
    piece = "assets/orange_piece.jpeg";
  }

  if (piece === "assets/orange_piece.jpeg") {
    piece = "assets/blue_piece.jpeg";
    pieceImage.src = "assets/blue_piece.jpeg";
  } else {
    piece = "assets/orange_piece.jpeg";
    pieceImage.src = "assets/orange_piece.jpeg";
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
  if (piece === "assets/blue_piece.jpeg") {
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
  boardSize = document.getElementById("board-size").value;
  opponent = document.getElementById("opponent").value;
  difficulty = document.getElementById("difficulty").value;
  firstToPlay = document.getElementById("first-to-play").value;

  // Hide the options and show the game section
  document.getElementById("options").style.display = "none";
  document.getElementById("game").style.display = "block";

  // Initialize and start the game logic here based on selected options
  // ...

  // For demonstration purposes, let's just log the selected options
  console.log("Selected options: ", {
    boardSize,
    opponent,
    difficulty,
    firstToPlay,
  });
}

function showRules() {
  // Variable to keep track of the current section
  let currentSection = 1;

  // Change display of popup element
  document.getElementById("rules-popup").style.display = "flex";

  // Get "Previous" and "Next" buttons
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

  // Add an event listener to close the pop-up when the close button is clicked
  closeButton.addEventListener("click", () => {
    document.getElementById("rules-popup").style.display = "none";
  });

  // Add an event listener to close the pop-up when ESCAPE is pressed
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

function showLeaderboard() {} // implement this

// Event listeners for buttons
document
  .getElementById("login-button")
  .addEventListener("click", displayLoginErrorMessage);
document
  .getElementById("play-as-guest-button")
  .addEventListener("click", handleLogin);
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
for (const button of document.getElementsByClassName("leaderboard-button")) {
  button.addEventListener("click", showLeaderboard);
}
for (const button of document.getElementsByClassName("rules-button")) {
  button.addEventListener("click", showRules);
}

// Add an event listener to the opponent dropdown
document
  .getElementById("opponent")
  .addEventListener("change", toggleDifficultyDiv);
