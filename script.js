let username = "guest";
let boardSize = "";
let opponent = "";
let difficulty = "";
let firstToPlay = "";

function handleLogin() {
  username = document.getElementById("username").value;
  document.getElementById("login").style.display = "none";
  document.getElementById("options").style.display = "block";
}

function goToHome() {
  document.getElementById("options").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("login").style.display = "block";
}

function startGame() {
  boardSize = document.getElementById("boardSize").value;
  opponent = document.getElementById("opponent").value;
  difficulty = document.getElementById("difficulty").value;
  firstToPlay = document.getElementById("firstToPlay").value;

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

function showInstructions() {
  // Variable to keep track of the current section
  let currentSection = 1;

  // Create a pop-up element
  const popup = document.createElement("div");
  popup.className = "popup";

  // Create the content for the pop-up
  const content = document.createElement("div");
  content.className = "popup-content";

  // Create a title header
  const title = document.createElement("h2");
  title.className = "popup-title";
  title.innerText = "Instruções";

  // Create a close button
  const closeButton = document.createElement("span");
  closeButton.className = "popup-close";
  closeButton.innerHTML = "&times;";

  // Create a paragraph element
  const instructions = document.createElement("p");

  // Load instructions from file
  let sections;
  fetch("instructions.txt")
    .then((response) => response.text())
    .then((text) => {
      // Split the text into sections based on "[Section x]"
      sections = text.split(/\[Section \d+\]/);
      // Display the first section
      instructions.innerHTML = sections[currentSection].trim();
    })
    .catch((error) => {
      console.error("Failed to fetch instructions:", error);
      instructions.innerText = "Failed to fetch instructions.";
    });

  // Create "Previous" and "Next" buttons
  const prevButton = document.createElement("button");
  prevButton.className = "prevButton";
  prevButton.innerHTML = "&lt;";
  const nextButton = document.createElement("button");
  nextButton.className = "nextButton";
  nextButton.innerHTML = "&gt;";

  // Event listener for "Previous" button
  prevButton.addEventListener("click", () => {
    if (currentSection > 1) {
      currentSection--;
      instructions.innerHTML = sections[currentSection].trim();
    }
  });

  // Event listener for "Next" button
  nextButton.addEventListener("click", () => {
    if (currentSection < sections.length - 1) {
      currentSection++;
      instructions.innerHTML = sections[currentSection].trim();
    }
  });

  // Append elements to the pop-up
  content.appendChild(closeButton);
  content.appendChild(title);
  content.appendChild(instructions);
  content.appendChild(prevButton);
  content.appendChild(nextButton);
  popup.appendChild(content);

  // Append the pop-up to the body
  document.body.appendChild(popup);

  // Add an event listener to close the pop-up when the close button is clicked
  closeButton.addEventListener("click", () => {
    document.body.removeChild(popup);
  });

  // Add an event listener to close the pop-up when ESCAPE is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.body.removeChild(popup);
    }
  });

  // Add an event listener to move to the previous section when the left arrow key is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && sections && currentSection > 1) {
      currentSection--;
      instructions.innerHTML = sections[currentSection].trim();
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
      instructions.innerHTML = sections[currentSection].trim();
    }
  });
}

function showLeaderboard() {} // implement this

// Event listeners for buttons
document
  .getElementById("playAsGuestButton")
  .addEventListener("click", handleLogin);
document.getElementById("startGameButton").addEventListener("click", startGame);
document.getElementById("homeScreenButton").addEventListener("click", goToHome);
document
  .getElementById("instructionsButton")
  .addEventListener("click", showInstructions);
document
  .getElementById("leaderboardButton")
  .addEventListener("click", showLeaderboard);
