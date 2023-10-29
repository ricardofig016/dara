export class Game {
  constructor(boardSize, opponent, difficulty, firstToPlay) {
    // Rows, cols
    if (boardSize === "6x5") {
      this.rows = 6;
      this.cols = 5;
    } else if (boardSize === "6x6") {
      this.rows = 6;
      this.cols = 6;
    }

    // Board
    this.board = Array.from(
      { length: this.rows },
      () => Array(this.cols).fill(null) // Each cell can be empty, orange, or blue
    );

    // Opponent, difficulty, turn, phase, prev_move, max_pieces
    this.opponent = "computer"; // IMPORTANT -> 1v1 not implemented yet
    this.difficulty = difficulty;
    this.turn = firstToPlay;
    this.phase = "drop"; // Can be 'drop' or 'move'
    this.orange_prev_move = null; // [oldRow, oldCol, newRow, newCol]
    this.blue_prev_move = null; // [oldRow, oldCol, newRow, newCol]
    this.max_pieces = 12; // Each player has a total of 12 pieces
  }

  flipTurn() {
    if (this.turn === "orange") {
      this.turn = "blue";
    } else {
      this.turn = "orange";
    }
    return;
  }

  dropPiece(row, col, color = this.turn) {
    if (this.isValidDrop(row, col, color)) {
      this.board[row][col] = color;
      return true;
    }
    return false;
  }

  canMove(row, col, color) {
    if (this.isValidCell(row, col)) {
      if (this.turn === color) {
        return true;
      }
    }
    return false;
  }

  movePiece(oldRow, oldCol, newRow, newCol) {
    if (this.isValidMove(oldRow, oldCol, newRow, newCol)) {
      // Store new previous move
      let color = this.board[oldRow][oldCol];
      if (color === "orange") {
        this.orange_prev_move = [oldRow, oldCol, newRow, newCol];
      } else {
        this.blue_prev_move = [oldRow, oldCol, newRow, newCol];
      }

      // Make move
      this.board[newRow][newCol] = this.board[oldRow][oldCol];
      this.board[oldRow][oldCol] = null;
      return true;
    }
    return false;
  }

  removePiece(row, col) {
    if (this.isValidCell(row, col) && this.board[row][col]) {
      this.board[row][col] = null;
      return true;
    }
    return false;
  }

  // Check if a cell exists on the board
  isValidCell(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  isValidDrop(row, col) {
    // The cell doesn't exist or
    // is already occupied or
    // the player has no more pieces
    if (
      !this.isValidCell(row, col) ||
      this.board[row][col] ||
      this.getPieces(this.turn) >= this.max_pieces
    ) {
      return false;
    }

    // Make sure row and col are numbers
    row = parseInt(row);
    col = parseInt(col);

    // Check horizontally
    let horizontalCount = 1;
    for (let i = col - 1; i >= 0 && this.board[row][i] === this.turn; i--) {
      horizontalCount++;
    }
    for (
      let i = col + 1;
      i < this.cols && this.board[row][i] === this.turn;
      i++
    ) {
      horizontalCount++;
    }
    if (horizontalCount >= 4) {
      return false; // 4-in-line horizontally
    }

    // Check vertically
    let verticalCount = 1;
    for (let i = row - 1; i >= 0 && this.board[i][col] === this.turn; i--) {
      verticalCount++;
    }
    for (
      let i = row + 1;
      i < this.rows && this.board[i][col] === this.turn;
      i++
    ) {
      verticalCount++;
    }
    if (verticalCount >= 4) {
      return false; // 4-in-line vertically
    }

    // The drop is valid
    return true;
  }

  // Amount of pieces of a color currently on the board
  getPieces(color) {
    let pieces = 0;
    for (let row of this.board) {
      for (let cell of row) {
        if (cell === color) {
          pieces++;
        }
      }
    }
    return pieces;
  }

  isValidMove(oldRow, oldCol, newRow, newCol) {
    if (
      !this.isValidCell(oldRow, oldCol) ||
      !this.isValidCell(newRow, newCol) ||
      !this.board[oldRow][oldCol] ||
      this.board[newRow][newCol] ||
      Math.abs(oldRow - newRow) + Math.abs(oldCol - newCol) != 1
    ) {
      return false;
    }

    let color = this.board[oldRow][oldCol];

    // Check if the piece is repeating previous move
    if (color === "orange") {
      if (this.orange_prev_move == [newRow, newCol, oldRow, oldCol]) {
        return false;
      }
    } else {
      if (this.blue_prev_move == [newRow, newCol, oldRow, oldCol]) {
        return false;
      }
    }

    // Check horizontally
    let horizontalCount = 1;
    for (let i = newCol - 1; i >= 0 && this.board[newRow][i] === color; i--) {
      horizontalCount++;
    }
    for (
      let i = newCol + 1;
      i < this.cols && this.board[newRow][i] === color;
      i++
    ) {
      horizontalCount++;
    }
    if (horizontalCount >= 4) {
      return false; // 4-in-line horizontally
    }

    // Check vertically
    let verticalCount = 1;
    for (let i = newRow - 1; i >= 0 && this.board[i][newCol] === color; i--) {
      verticalCount++;
    }
    for (
      let i = newRow + 1;
      i < this.rows && this.board[i][newCol] === color;
      i++
    ) {
      verticalCount++;
    }
    if (verticalCount >= 4) {
      return false; // 4-in-line vertically
    }

    // The move is valid
    return true;
  }
}

export default Game;
