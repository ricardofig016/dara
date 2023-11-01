import Game from "./game.js";

let username = "";
let boardSize = "";
let piece = "assets/orange_piece.png";
let opponent = "";
let difficulty = "";
let firstToPlay = "";
let moves_played = 0;

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

  // Reset previous options
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

function fillGameInfoText() {
  // Reset moves played
  moves_played = 0;

  // Turn
  updateGameInfoTurn();

  // Phase
  updateGameInfoPhase("drop");

  // Piece Color
  if (piece.includes("orange")) {
    document.getElementById("game-info-color").textContent = "orange";
  } else {
    document.getElementById("game-info-color").textContent = "blue";
  }

  // Opponent
  document.getElementById("game-info-opponent").textContent = opponent;

  // Difficulty
  document.getElementById("game-info-diff").textContent = difficulty;
  if (opponent != "computer") {
    document.getElementById("game-info-diff").parentElement.style.display =
      "none";
  } else {
    document.getElementById("game-info-diff").parentElement.style.display =
      "block";
  }

  // Moves played
  updateGameInfoMove();
}

function updateGameInfoTurn() {
  // get first and second player's names
  let first_p = "";
  let second_p = "";
  if (piece.includes(firstToPlay)) {
    first_p = username;
    second_p = opponent;
  } else {
    first_p = opponent;
    second_p = username;
  }

  // Its player 1's turn
  if (moves_played % 2 === 0) {
    document.getElementById("game-info-turn").textContent = first_p;
  } else {
    document.getElementById("game-info-turn").textContent = second_p;
  }
}

function updateGameInfoPhase(phase) {
  document.getElementById("game-info-phase").textContent = phase;
}

function updateGameInfoMove() {
  document.getElementById("game-info-move").textContent = Math.floor(
    moves_played / 2 + 1
  );
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

  // Update text of game-info-div
  fillGameInfoText();

  // Create Game object
  const game = new Game(boardSize, opponent, difficulty, firstToPlay);

  // For testing
  //game.dropPiece(0, 0, "blue");
  //game.dropPiece(0, 1, "orange");
  //game.dropPiece(0, 2, "blue");
  //game.dropPiece(0, 3, "orange");
  //game.dropPiece(0, 4, "blue");
  //game.dropPiece(1, 0, "orange");
  //game.dropPiece(1, 1, "blue");
  //game.dropPiece(1, 2, "orange");
  //game.dropPiece(1, 3, "blue");
  //game.dropPiece(1, 4, "orange");
  //game.dropPiece(2, 0, "blue");
  //game.dropPiece(2, 1, "orange");
  //game.dropPiece(2, 2, "blue");
  //game.dropPiece(2, 3, "orange");
  //game.dropPiece(2, 4, "blue");
  //game.dropPiece(3, 0, "orange");
  //game.dropPiece(3, 1, "blue");
  //game.dropPiece(3, 2, "orange");
  //game.dropPiece(3, 3, "blue");
  //game.dropPiece(3, 4, "orange");
  //game.dropPiece(4, 0, "blue");
  //game.dropPiece(4, 1, "orange");
  //game.dropPiece(4, 2, "blue");

  createGameElements(game);
  resetPieceSets();

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
      cell.dataset.selected = "false";
      cell.style.width = cellSize + "px";
      cell.style.height = cellSize + "px";

      // Change background-color of the cell based on parity
      if ((row + col) % 2 == 0) {
        cell.style.backgroundColor = "#fafafa";
      } else {
        cell.style.backgroundColor = "#cacaca";
      }

      // Add piece if exists
      if (game.board[row][col]) {
        const piece = document.createElement("img");
        piece.classList.add("piece");
        if (game.board[row][col] === "orange") {
          piece.src = orangePiecePath;
          piece.alt = "orange";
        } else {
          piece.src = bluePiecePath;
          piece.alt = "blue";
        }
        cell.appendChild(piece);
      }

      // Append cell to board div
      boardDiv.appendChild(cell);
    }
  }

  // Add event listeners for each cell
  for (const cell of document.getElementsByClassName("cell")) {
    cell.addEventListener("click", () => {
      handleClickCell(game, cell);
    });
  }
}

function handleClickCell(game, cell) {
  // Handle click for each phase
  if (game.phase === "drop") {
    handleClickCellOnDropPhase(game, cell);
  } else if (game.phase === "move") {
    handleClickCellOnMovePhase(game, cell);
  } else if (game.phase === "take") {
    handleClickCellOnTakePhase(game, cell);
  } else {
    console.error("not a valid phase name");
  }

  // Check if game is over
  if (game.phase == "move" && game.isGameOver()) {
    let player_wins = true;
    if (piece.includes(game.turn)) {
      player_wins = false;
    }
    // Insert a 1000ms delay
    setTimeout(function () {
      showGameOver(player_wins);
    }, 1000);
  }
  return;
}

function handleClickCellOnDropPhase(game, cell) {
  const row = cell.dataset.row;
  const col = cell.dataset.col;

  // Drop piece
  if (game.dropPiece(row, col)) {
    console.log("piece dropped successfully");
    hidePieceFromPieceSet(game.turn);
    moves_played++;
    game.flipTurn();
    updateGameInfoTurn();
    updateGameInfoMove();

    // Recreate board
    createGameElements(game);
  } else {
    console.log("this drop is not valid");
  }

  // Advance to move phase
  const orange_p = game.getPieces("orange");
  const blue_p = game.getPieces("blue");
  if (orange_p === blue_p && orange_p >= game.max_pieces) {
    game.phase = "move";
    updateGameInfoPhase("move");
    flipPieceSets();
  }
  return;
}

function handleClickCellOnMovePhase(game, cell) {
  function revertAllCells() {
    revertCellColors();
    revertSelectedCells();
  }

  // Revert cell background color back to original
  function revertCellColor(cell) {
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);
    if ((row + col) % 2 === 0) {
      cell.style.backgroundColor = "#fafafa";
    } else {
      cell.style.backgroundColor = "#cacaca";
    }
  }

  function revertSelectedCells() {
    for (let row = 0; row < game.rows; row++) {
      for (let col = 0; col < game.cols; col++) {
        const curr_cell = document.querySelector(
          `[data-row="${row}"][data-col="${col}"]`
        );
        curr_cell.dataset.selected = "false";
        if (curr_cell.querySelector(".piece")) {
          highlightSelectedCell(curr_cell);
        }
      }
    }
  }

  function revertCellColors() {
    for (let row = 0; row < game.rows; row++) {
      for (let col = 0; col < game.cols; col++) {
        const curr_cell = document.querySelector(
          `[data-row="${row}"][data-col="${col}"]`
        );
        revertCellColor(curr_cell);
      }
    }
  }

  // Make the piece appear bigger if selected
  function highlightSelectedCell(cell) {
    let piece_img = cell.querySelector(".piece");
    if (cell.dataset.selected === "true") {
      piece_img.style.transform = "scale(1.3)";
    } else {
      piece_img.style.transform = "scale(1)";
    }
  }

  function colorValidCells() {
    for (let row = 0; row < game.rows; row++) {
      for (let col = 0; col < game.cols; col++) {
        const candidate_cell = document.querySelector(
          `[data-row="${row}"][data-col="${col}"]`
        );
        if (game.isValidMove(cell.dataset.row, cell.dataset.col, row, col)) {
          candidate_cell.style.backgroundColor = "#73df3b";
        }
      }
    }
  }

  function firstSelection() {
    let piece_img = cell.querySelector(".piece");

    // Tried to select an empty cell
    if (!piece_img) {
      console.log("the cell is empty");
      return;
    }

    // Find color of the selected piece
    let color = "";
    if (piece_img.src.includes("orange")) {
      color = "orange";
    } else if (piece_img.src.includes("blue")) {
      color = "blue";
    } else {
      console.error("invalid piece color");
      return;
    }

    // Tried to select a piece on the other color's turn
    if (color != game.turn) {
      console.log("not your turn");
    }

    // Select the cell
    if (
      game.isValidCell(cell.dataset.row, cell.dataset.col) &&
      game.turn === color
    ) {
      cell.dataset.selected = "true";
      colorValidCells();
      highlightSelectedCell(cell);
    }
    return;
  }

  function secondSelection() {
    // Find selected cell
    let selected_cell = null;
    for (let row = 0; row < game.rows; row++) {
      for (let col = 0; col < game.cols; col++) {
        let candidate_cell = document.querySelector(
          `[data-row="${row}"][data-col="${col}"]`
        );
        if (candidate_cell.dataset.selected === "true") {
          selected_cell = candidate_cell;
          break;
        }
      }
    }

    if (!selected_cell) {
      console.error("no cell is selected");
      return;
    }

    // Move piece
    let move_result = game.movePiece(
      selected_cell.dataset.row,
      selected_cell.dataset.col,
      cell.dataset.row,
      cell.dataset.col
    );
    if (move_result === 1) {
      console.log("piece moved successfully");
      moves_played++;
      game.flipTurn();
      updateGameInfoTurn();
      updateGameInfoMove();

      // Recreate board
      createGameElements(game);
      revertAllCells();
    } else if (move_result === 2) {
      console.log("piece moved successfully");
      game.phase = "take";
      updateGameInfoPhase("move"); // 'take' phase is displayed as 'move'

      // Recreate board
      createGameElements(game);
      revertAllCells();
    } else if (move_result === 0) {
      revertAllCells();
      // Reselect another piece
      if (cell != selected_cell) {
        firstSelection();
      }
    }
    return;
  }

  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.cols; col++) {
      const curr_cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      if (curr_cell.dataset.selected === "true") {
        secondSelection();
        return;
      }
    }
  }
  firstSelection();
  return;
}

function handleClickCellOnTakePhase(game, cell) {
  const row = cell.dataset.row;
  const col = cell.dataset.col;

  // Remove piece
  if (game.removePiece(row, col)) {
    console.log("piece removed successfully");
    moves_played++;
    game.flipTurn();
    showPieceFromPieceSet(game.turn);
    updateGameInfoTurn();
    game.phase = "move"; // Revert back to move phase
    updateGameInfoPhase("move");
    updateGameInfoMove();

    // Recreate board
    createGameElements(game);
  } else {
    console.log("this take is not valid");
  }
}

function hidePieceFromPieceSet(color) {
  const pieces = document
    .getElementById("board-and-pieces")
    .getElementsByClassName("piece-image");

  let target_piece = "";
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (
      piece.getAttribute("src").includes(color) &&
      piece.style.display != "none"
    ) {
      target_piece = piece;
    }
  }
  // Hide piece-image
  target_piece.style.display = "none";
  return;
}

function showPieceFromPieceSet(color) {
  const pieces = document
    .getElementById("board-and-pieces")
    .getElementsByClassName("piece-image");

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (
      piece.getAttribute("src").includes(color) &&
      piece.style.display === "none"
    ) {
      // Show piece-image
      piece.style.display = "inline";
      return;
    }
  }
  return;
}

function resetPieceSets() {
  const pieces = document
    .getElementById("board-and-pieces")
    .getElementsByClassName("piece-image");

  console.log(pieces[0].getAttribute("src"));
  console.log(piece);
  if (pieces[0].getAttribute("src") != piece) {
    flipPieceSets();
  }

  for (let i = 0; i < pieces.length; i++) {
    pieces[i].style.display = "inline";
  }
  return;
}

function flipPieceSets() {
  const pieces = document
    .getElementById("board-and-pieces")
    .getElementsByClassName("piece-image");

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (piece.getAttribute("src").includes("orange")) {
      piece.setAttribute("src", bluePiecePath);
    } else {
      piece.setAttribute("src", orangePiecePath);
    }
  }
  return;
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

function showGameOver(player_wins) {
  // Display popup
  document.getElementById("winner-popup").style.display = "flex";

  // Get elements
  const closeButton = document.getElementById("winner-popup-close");

  // Find win or lose
  let winner_p = document.getElementById("winner-popup-result");
  if (player_wins) {
    winner_p.style.color = "#008800";
    winner_p.textContent = "You Win!!";
  } else {
    winner_p.style.color = "#dd0000";
    winner_p.textContent = "You Lose...";
  }

  // Add an event listener to close the popup when the close button is clicked
  closeButton.addEventListener("click", () => {
    document.getElementById("winner-popup").style.display = "none";
    goToOptions();
  });

  // Add an event listener to close the popup when ESCAPE is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.getElementById("winner-popup").style.display = "none";
      goToOptions();
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
