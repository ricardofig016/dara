class Game {
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

    // Opponent, difficulty, turn
    this.opponent = "computer"; // IMPORTANT -> 1v1 not implemented yet
    this.difficulty = difficulty;
    this.turn = firstToPlay;

    // Phase
    this.phase = "drop"; // Can be 'drop' or 'move'
  }

  insertPiece(row, col, color) {
    if (this.isValidCell(row, col) && !this.board[row][col]) {
      this.board[row][col] = { color };
      return true;
    }
    return false;
  }

  movePiece(oldRow, oldCol, newRow, newCol) {
    if (
      this.isValidCell(oldRow, oldCol) &&
      this.isValidCell(newRow, newCol) &&
      this.board[oldRow][oldCol] && // There's a piece on this cell
      !this.board[newRow][newCol] && // There's no piece on this cell
      Math.abs(oldRow - newRow) === 1 && //Target is 1 row away
      Math.abs(oldCol - newCol) === 1 //Target is 1 col away
    ) {
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
}

export default Game;
