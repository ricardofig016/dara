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
    this.phase = "drop"; // Can be 'drop', 'move' or 'take'
    this.orange_prev_move = null; // [oldRow, oldCol, newRow, newCol]
    this.blue_prev_move = null; // [oldRow, oldCol, newRow, newCol]
    this.max_pieces = 3; // Each player has a total of 12 pieces
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
    // Make sure row and col are numbers
    row = parseInt(row);
    col = parseInt(col);

    if (this.isValidDrop(row, col, color)) {
      this.board[row][col] = color;
      return true;
    }
    return false;
  }

  canMove(row, col, color) {
    if (this.isValidCell(row, col)) {
      if (this.turn === color) {
        if (
          this.isValidMove(row, col, row + 1, col) ||
          this.isValidMove(row, col, row, col + 1) ||
          this.isValidMove(row, col, row - 1, col) ||
          this.isValidMove(row, col, row, col - 1)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  movePiece(oldRow, oldCol, newRow, newCol) {
    /**
     * returns:
     *  0 , if it fails to move the piece
     *  1 , if the move does not make a line
     *  2 , if the move makes a line
     */

    // Make sure rows and cols are numbers
    oldRow = parseInt(oldRow);
    oldCol = parseInt(oldCol);
    newRow = parseInt(newRow);
    newCol = parseInt(newCol);

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

      // Check for 3-in-line
      if (this.makesLine(newRow, newCol)) {
        return 2;
      } else {
        return 1;
      }
    }
    return 0;
  }

  makesLine(row, col) {
    // Make sure row and col are numbers
    row = parseInt(row);
    col = parseInt(col);

    // The cell doesnt exist or is empty
    if (!this.isValidCell(row, col) || !this.board[row][col]) {
      return false;
    }

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
    if (horizontalCount >= 3) {
      return true; // 3-in-line horizontally
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
    if (verticalCount >= 3) {
      return true; // 3-in-line vertically
    }

    // There is no 3 in line
    return false;
  }

  removePiece(row, col, turn = this.turn) {
    // Make sure row and col are numbers
    row = parseInt(row);
    col = parseInt(col);

    // Find piece color
    let color = null;
    if (turn === "orange") {
      color = "blue";
    } else if (turn === "blue") {
      color = "orange";
    } else {
      return false;
    }

    // If is cell is valid and
    // if cell is not empty and
    // if cell is opposite of turn
    if (
      this.isValidCell(row, col) &&
      this.board[row][col] &&
      this.board[row][col] === color
    ) {
      this.board[row][col] = null;
      return true;
    }
    return false;
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

  // Check if a cell exists on the board
  isValidCell(row, col) {
    // Make sure row and col are numbers
    row = parseInt(row);
    col = parseInt(col);
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  isValidDrop(row, col) {
    // Make sure row and col are numbers
    row = parseInt(row);
    col = parseInt(col);

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

  isValidMove(oldRow, oldCol, newRow, newCol) {
    // Make sure rows and cols are numbers
    oldRow = parseInt(oldRow);
    oldCol = parseInt(oldCol);
    newRow = parseInt(newRow);
    newCol = parseInt(newCol);

    if (
      !this.isValidCell(oldRow, oldCol) ||
      !this.isValidCell(newRow, newCol) ||
      !this.board[oldRow][oldCol] ||
      this.board[newRow][newCol] ||
      Math.abs(oldRow - newRow) + Math.abs(oldCol - newCol) != 1
    ) {
      return false;
    }

    const color = this.board[oldRow][oldCol];

    // Assign right previous move
    let prev_m = null;
    if (color === "orange") {
      prev_m = this.orange_prev_move;
    } else {
      prev_m = this.blue_prev_move;
    }

    // Check if the piece is repeating previous move
    if (
      prev_m &&
      prev_m[0] === newRow &&
      prev_m[1] === newCol &&
      prev_m[2] === oldRow &&
      prev_m[3] === oldCol
    ) {
      return false;
    }

    // Check horizontally
    let horizontalCount = 1;
    for (
      let i = newCol - 1;
      i >= 0 &&
      this.board[newRow][i] === color &&
      !(newRow === oldRow && i === oldCol);
      i--
    ) {
      horizontalCount++;
    }
    for (
      let i = newCol + 1;
      i < this.cols &&
      this.board[newRow][i] === color &&
      !(newRow === oldRow && i === oldCol);
      i++
    ) {
      horizontalCount++;
    }
    if (horizontalCount >= 4) {
      return false; // 4-in-line horizontally
    }

    // Check vertically
    let verticalCount = 1;
    for (
      let i = newRow - 1;
      i >= 0 &&
      this.board[i][newCol] === color &&
      !(i === oldRow && newCol === oldCol);
      i--
    ) {
      verticalCount++;
    }
    for (
      let i = newRow + 1;
      i < this.rows &&
      this.board[i][newCol] === color &&
      !(i === oldRow && newCol === oldCol);
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

  isGameOver(color = this.turn) {
    // true if:
    //  - the player cant make a valid move or
    //  - has less then 3 pieces
    let piece_count = 0;
    let can_move = false;
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col] === color) {
          piece_count++;
          if (this.canMove(row, col, color)) {
            can_move = true;
          }
        }
      }
    }
    if (piece_count < 3 || !can_move) {
      return true;
    }
    return false;
  }
}

export default Game;
