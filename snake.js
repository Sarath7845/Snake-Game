// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

// Game settings
const gridSize = 30;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = true;

// Initialize the game
function init() {
    // Reset game state
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    gameRunning = true;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    restartBtn.style.display = 'none';
    
    // Generate first food
    generateFood();
    
    // Start game loop
    gameLoop();
}

// Generate random food position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// Draw everything on canvas
function draw() {
    // Clear canvas
    ctx.fillStyle = '#FFF0F5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake body (skip the head)
    ctx.fillStyle = '#4CAF50';
    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Draw snake head with enhanced design
    const head = snake[0];
    const headX = head.x * gridSize;
    const headY = head.y * gridSize;
    const size = gridSize - 2;
    
    // Head background (brighter green)
    ctx.fillStyle = '#66BB6A';
    ctx.fillRect(headX, headY, size, size);
    
    // Add head border for definition
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2;
    ctx.strokeRect(headX, headY, size, size);
    
    // Draw eyes based on direction
    ctx.fillStyle = '#000';
    const eyeSize = 3;
    const eyeOffset = 4;
    
    if (dx === 1) { // Moving right
        // Right-facing eyes
        ctx.fillRect(headX + size - eyeOffset - eyeSize, headY + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(headX + size - eyeOffset - eyeSize, headY + size - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (dx === -1) { // Moving left
        // Left-facing eyes
        ctx.fillRect(headX + eyeOffset, headY + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(headX + eyeOffset, headY + size - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (dy === -1) { // Moving up
        // Up-facing eyes
        ctx.fillRect(headX + eyeOffset, headY + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(headX + size - eyeOffset - eyeSize, headY + eyeOffset, eyeSize, eyeSize);
    } else if (dy === 1) { // Moving down
        // Down-facing eyes
        ctx.fillRect(headX + eyeOffset, headY + size - eyeOffset - eyeSize, eyeSize, eyeSize);
        ctx.fillRect(headX + size - eyeOffset - eyeSize, headY + size - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else {
        // Default eyes (facing right) when not moving
        ctx.fillRect(headX + size - eyeOffset - eyeSize, headY + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(headX + size - eyeOffset - eyeSize, headY + size - eyeOffset - eyeSize, eyeSize, eyeSize);
    }
    
    // Draw food
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Update game state
function update() {
    if (!gameRunning) return;
    
    // Move snake head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

// Game over function
function gameOver() {
    gameRunning = false;
    gameOverElement.style.display = 'block';
    restartBtn.style.display = 'inline-block';
}

// Restart game function
function restartGame() {
    init();
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!gameRunning) return;
    
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    // Prevent reverse direction
    switch(e.keyCode) {
        case LEFT_KEY:
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case UP_KEY:
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case RIGHT_KEY:
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
        case DOWN_KEY:
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    
    if (gameRunning) {
        setTimeout(gameLoop, 100); // Game speed (100ms = 10 FPS)
    }
}

// Event listeners
document.addEventListener('keydown', handleKeyPress);

// Start the game
init();
