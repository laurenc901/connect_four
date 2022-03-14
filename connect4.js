/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = [];

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
    for (let y = 0; y < HEIGHT; y++) {
      board.push(Array.from({ length: WIDTH }));
    } 
}


function makeHtmlBoard() {
  //create header for top of board
  const board = document.getElementById('board');
  const top = document.createElement("tr");
  // give it id of column top
  top.setAttribute("id", "column-top");
  // add an event listener to the top row when clicked and run handleClick function
  top.addEventListener("click", handleClick);
//loop over the # of cells needed and create cells 
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
   //give cells id of their # in line 
    headCell.setAttribute("id", x);
   // append the cells to the header
    top.append(headCell);
  }
 // append header to board
  board.append(top);

  //loop over row # 
  for (let y = 0; y < HEIGHT; y++) {
    //create table row
    const row = document.createElement("tr");
    // loop over width
    for (let x = 0; x < WIDTH; x++) {
      //create cells for each column
      const cell = document.createElement("td");
      // set id for each cell "row#-column#"
      cell.setAttribute("id", `${y}-${x}`);
      //append cell to row
      row.append(cell);
    }
    //append row to board
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}


/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const div = document.createElement('div');
  div.classList.add('piece');
  div.classList.add( `player${currPlayer}`);
  const pieceLoc = document.getElementById(`${y}-${x}`);
  pieceLoc.append(div);
}

/** endGame: announce game end */

function endGame(msg) {
 alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
//loop over rows/columns
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // loops over all horizontal, vertical and diagonal possibilities for matches
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
     // if there is a match of 4 pieces in any of the horizontal, vertical or diagonal possibilities
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        // return true
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
