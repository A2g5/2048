const gridSize = 4;
let board = [];
let gameOver = false;
let aiMode = false;
let switchCooldown = false;

// Initialize the board
function initBoard() {
    board = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    addRandomTile();
    addRandomTile();
    renderBoard();
}

// Add a random tile (2 or 4)
function addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c] === 0) emptyCells.push({
                r,
                c
            });
        }
    }
    if (emptyCells.length > 0) {
        let {
            r,
            c
        } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Render the board on screen
function renderBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    board.forEach(row => {
        row.forEach(cell => {
            let tile = document.createElement("div");
            tile.className = "tile";
            tile.textContent = cell !== 0 ? cell : ""; // Display the number if not 0
            gameBoard.appendChild(tile);
        });
    });
}

// Move tiles based on direction
function moveTiles(direction) {
    if (gameOver) return;
    let rotated = rotateBoard(direction);
    for (let r = 0; r < gridSize; r++) {
        let filtered = rotated[r].filter(v => v);
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                filtered[i + 1] = 0;
            }
        }
        rotated[r] = filtered.filter(v => v).concat(Array(gridSize - filtered.length).fill(0));
    }
    board = rotateBoardBack(rotated, direction);
    addRandomTile();
    renderBoard();
    checkGameOver();
}

// Rotate board for easier movement handling
function rotateBoard(direction) {
    let newBoard = Array.from({
        length: gridSize
    }, () => Array(gridSize).fill(0));
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (direction === "ArrowUp") newBoard[c][r] = board[r][c];
            if (direction === "ArrowDown") newBoard[c][r] = board[gridSize - 1 - r][c];
            if (direction === "ArrowLeft") newBoard[r][c] = board[r][c];
            if (direction === "ArrowRight") newBoard[r][c] = board[r][gridSize - 1 - c];
        }
    }
    return newBoard;
}

function rotateBoardBack(rotated, direction) {
    let newBoard = Array.from({
        length: gridSize
    }, () => Array(gridSize).fill(0));
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (direction === "ArrowUp") newBoard[r][c] = rotated[c][r];
            if (direction === "ArrowDown") newBoard[r][c] = rotated[c][gridSize - 1 - r];
            if (direction === "ArrowLeft") newBoard[r][c] = rotated[r][c];
            if (direction === "ArrowRight") newBoard[r][c] = rotated[r][gridSize - 1 - c];
        }
    }
    return newBoard;
}

// Check for game over
function checkGameOver() {
    if (board.flat().includes(0)) return;
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize - 1; c++) {
            if (board[r][c] === board[r][c + 1] || board[c][r] === board[c + 1][r]) return;
        }
    }
    gameOver = true;
    alert("Game Over!");
}

// AI Move logic (random for now, can be improved)
function aiMove() {
    if (!aiMode || gameOver) return;
    let moves = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    moveTiles(moves[Math.floor(Math.random() * moves.length)]);
    setTimeout(aiMove, 500);
}

// Key press handler
document.addEventListener("keydown", (event) => {
    if (event.key === "w" && !switchCooldown) {
        aiMode = !aiMode;
        console.log(aiMode ? "Switched to AI mode" : "Switched to Human mode");
        switchCooldown = true;
        setTimeout(() => switchCooldown = false, 3000);
        if (aiMode) aiMove();
    } else if (!aiMode && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        moveTiles(event.key);
    }
});

// Start the game
initBoard();
