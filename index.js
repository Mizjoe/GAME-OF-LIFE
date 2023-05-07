const unitLength = 10;
let boxColorR = 255;
let boxColorG = 201;
let boxColorB = 0;

const strokeColor = `blue`;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(1000, 470);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.
  initBoard(); // Set the initial values of the currentBoard and nextBoard
}

function initBoard() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

document.querySelector("#reset-game").addEventListener("click", function () {
  initBoard();
});
function draw() {
  background(255);
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(boxColorR, boxColorG, boxColorB);
      } else {
        fill(34);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
}

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < 2) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > 3) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == 3) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  fill(boxColorR, boxColorG, boxColorB);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop();
  mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
  loop();
}

let isGameRunning = true;

function mouseCicked() {
  console.log(isGameRunning);
  //if game running
  if (isGameRunning) {
    mousePressed();
    isGameRunning = false;
  }
  //if game stop
  else {
    loop();
    isGameRunning = true;
  }
}
document.querySelector("#stop-game").addEventListener("click", function () {
  mouseCicked();
});

function randomBoxColor() {
  //gen bar1 random number and value change
  let r = Math.floor(Math.random() * 255) + 1;
  document.querySelector(`#slider-R`).value = r;

  //gen bar2 random number and value change
  let g = Math.floor(Math.random() * 255) + 1;
  document.querySelector("#slider-G").value = g;

  //gen bar3 random number and value change
  let b = Math.floor(Math.random() * 255) + 1;
  document.querySelector(`#slider-B`).value = b;
  //box color change
  boxColorR = r;
  boxColorG = g;
  boxColorB = b;
}

document.querySelector("#rc").addEventListener("click", function () {
  randomBoxColor();
});

document.querySelector("#slider-R").addEventListener("input", function () {
  boxColorR = document.querySelector("#slider-R").value;
});

document.querySelector("#slider-G").addEventListener("input", function () {
  boxColorG = document.querySelector("#slider-G").value;
});

document.querySelector("#slider-B").addEventListener("input", function () {
  boxColorB = document.querySelector("#slider-B").value;
});
