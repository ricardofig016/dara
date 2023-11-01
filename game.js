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
    this.opponent = opponent;
    this.difficulty = difficulty; // Can be 'easy', 'medium' or 'hard'
    this.turn = firstToPlay;
    this.phase = "drop"; // Can be 'drop', 'move' or 'take'
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

  willMakeLine(oldRow, oldCol, newRow, newCol) {
    // Make sure row and col are numbers
    oldRow = parseInt(oldRow);
    oldCol = parseInt(oldCol);
    newRow = parseInt(newRow);
    newCol = parseInt(newCol);

    // The cell doesnt exist
    if (
      !this.isValidCell(newRow, newCol) ||
      !this.isValidCell(oldRow, oldCol)
    ) {
      return false;
    }

    // Check horizontally
    let horizontalCount = 1;
    for (
      let i = newCol - 1;
      i >= 0 &&
      this.board[newRow][i] === this.turn &&
      (newRow != oldRow || i != oldCol);
      i--
    ) {
      horizontalCount++;
    }
    for (
      let i = newCol + 1;
      i < this.cols &&
      this.board[newRow][i] === this.turn &&
      (newRow != oldRow || i != oldCol);
      i++
    ) {
      horizontalCount++;
    }
    if (horizontalCount >= 3) {
      return true; // 3-in-line horizontally
    }

    // Check vertically
    let verticalCount = 1;
    for (
      let i = newRow - 1;
      i >= 0 &&
      this.board[i][newCol] === this.turn &&
      (i != oldRow || newCol != oldCol);
      i--
    ) {
      verticalCount++;
    }
    for (
      let i = newRow + 1;
      i < this.rows &&
      this.board[i][newCol] === this.turn &&
      (i != oldRow || newCol != oldCol);
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

  playComputer() {
    /**
     * Returns:
     *  - 0 , if nothing was played
     *  - 1 , if something was played without taking pieces
     *  - 2 , if a piece was taken
     */
    if (this.opponent != "computer") {
      return 0;
    }
    // Select phase
    if (this.phase === "drop") {
      this.playComputerDrop();
      return 1;
    } else if (this.phase === "move") {
      return this.playComputerMove();
    } else if (this.phase === "take") {
      this.playComputerTake();
      return 2;
    }
  }

  playComputerDrop() {
    // Store valid drops
    let valid_drops = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.isValidDrop(row, col)) {
          valid_drops.push([row, col]);
        }
      }
    }

    if (this.difficulty === "easy" || this.difficulty === "medium") {
      // Select random valid drop
      const random_index = Math.floor(Math.random() * valid_drops.length);
      const random_drop = valid_drops[random_index];
      // Play random drop
      this.dropPiece(random_drop[0], random_drop[1]);
    } else if (this.difficulty === "hard") {
      // 'Hard' difficulty not implemented yet
    }
  }

  playComputerMove() {
    // Store pieces that can move
    let valid_pieces = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.canMove(row, col, this.board[row][col])) {
          valid_pieces.push([row, col]);
        }
      }
    }
    // Store valid moves
    let valid_moves = [];
    for (let i = 0; i < valid_pieces.length; i++) {
      const [row, col] = valid_pieces[i];
      if (this.isValidMove(row, col, row + 1, col)) {
        valid_moves.push([row, col, row + 1, col]);
      }
      if (this.isValidMove(row, col, row, col + 1)) {
        valid_moves.push([row, col, row, col + 1]);
      }
      if (this.isValidMove(row, col, row - 1, col)) {
        valid_moves.push([row, col, row - 1, col]);
      }
      if (this.isValidMove(row, col, row, col - 1)) {
        valid_moves.push([row, col, row, col - 1]);
      }
    }
    // Select random move
    const random_index = Math.floor(Math.random() * valid_moves.length);
    const random_move = valid_moves[random_index];

    if (this.difficulty === "easy") {
      // Play random move
      if (
        this.movePiece(
          random_move[0],
          random_move[1],
          random_move[2],
          random_move[3]
        ) === 2
      ) {
        // The move makes a 3-in-line
        this.playComputerTake();
        return 2;
      }
      return 1;
    } else if (this.difficulty === "medium") {
      // Play move that makes 3-in-line
      for (let valid_move of valid_moves) {
        if (
          this.willMakeLine(
            valid_move[0],
            valid_move[1],
            valid_move[2],
            valid_move[3]
          )
        ) {
          this.movePiece(
            valid_move[0],
            valid_move[1],
            valid_move[2],
            valid_move[3]
          );
          this.playComputerTake();
          return 2;
        }
      }
      // Play random move
      this.movePiece(
        random_move[0],
        random_move[1],
        random_move[2],
        random_move[3]
      );
      return 1;
    } else if (this.difficulty === "hard") {
      // 'Hard' difficulty not implemented yet
    }
  }

  playComputerTake() {
    // Store valid takes
    let valid_takes = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col] && this.board[row][col] != this.turn) {
          valid_takes.push([row, col]);
        }
      }
    }

    if (this.difficulty === "easy" || this.difficulty === "medium") {
      // Select random take
      const random_index = Math.floor(Math.random() * valid_takes.length);
      const random_take = valid_takes[random_index];
      // Take random piece
      this.removePiece(random_take[0], random_take[1]);
    } else if (this.difficulty === "hard") {
      // 'Hard' difficulty not implemented yet
    }
    return;
  }
}

export default Game;
