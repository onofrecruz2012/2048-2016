let board;
let score = 0;

// Mapping 2048 values to iconic 2016 tumblr themes
const tumblrWords = {
  2: "pale",
  4: "grunge",
  8: "indie",
  16: "soft",
  32: "lanadelrey",
  64: "vinyl",
  128: "sad boy",
  256: "glitch",
  512: "space",
  1024: "suburban",
  2048: "✨aesthetic✨"
};

function startGame() {
  board = Array(4).fill().map(() => Array(4).fill(0));
  score = 0;
  document.getElementById('game-over').classList.add('hidden');
  spawnTile();
  spawnTile();
  updateView();
}

function spawnTile() {
  let emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) emptyCells.push({r, c});
    }
  }
  if (emptyCells.length > 0) {
    let {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function updateView() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let tile = document.createElement('div');
      tile.className = 'tile';
      let value = board[r][c];
      if (value > 0) {
        tile.innerText = tumblrWords[value] || value;
        tile.classList.add(`tile-${value}`);
      }
      grid.appendChild(tile);
    }
  }
  document.getElementById('score').innerText = score;
  if (isGameOver()) document.getElementById('game-over').classList.remove('hidden');
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i+1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i+1] = 0;
    }
  }
  arr = arr.filter(val => val);
  while (arr.length < 4) arr.push(0);
  return arr;
}

function moveLeft() {
  let changed = false;
  for (let r = 0; r < 4; r++) {
    let nextRow = slide(board[r]);
    if (JSON.stringify(board[r]) !== JSON.stringify(nextRow)) changed = true;
    board[r] = nextRow;
  }
  return changed;
}

function moveRight() {
  let changed = false;
  for (let r = 0; r < 4; r++) {
    let nextRow = slide([...board[r]].reverse()).reverse();
    if (JSON.stringify(board[r]) !== JSON.stringify(nextRow)) changed = true;
    board[r] = nextRow;
  }
  return changed;
}

function rotateBoard() {
  board = board.map((val, index) => board.map(row => row[index]).reverse());
}

function moveUp() {
  rotateBoard(); rotateBoard(); rotateBoard();
  let changed = moveLeft();
  rotateBoard();
  return changed;
}

function moveDown() {
  rotateBoard();
  let changed = moveLeft();
  rotateBoard(); rotateBoard(); rotateBoard();
  return changed;
}

function isGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return false;
      if (c < 3 && board[r][c] === board[r][c+1]) return false;
      if (r < 3 && board[r][c] === board[r+1][c]) return false;
    }
  }
  return true;
}

window.addEventListener('keydown', (e) => {
  let moved = false;
  if (e.key === 'ArrowLeft') moved = moveLeft();
  if (e.key === 'ArrowRight') moved = moveRight();
  if (e.key === 'ArrowUp') moved = moveUp();
  if (e.key === 'ArrowDown') moved = moveDown();
  
  if (moved) {
    spawnTile();
    updateView();
  }
});

function resetGame() { startGame(); }
startGame();
