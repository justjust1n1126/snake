// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set up game variables
const gridSize = 20; // Size of each grid cell
const canvasSize = 400; // Width and height of the canvas
let snake = [{ x: 160, y: 160 }]; // Initial snake starting position
let food = spawnFood(); // Randomly spawn food
let direction = null; // No initial movement direction
let gameOver = false;
let score = 0;
let playerName = prompt("Enter your name for the leaderboard:");

// Leaderboard data
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let lastResetTime = parseInt(localStorage.getItem("lastResetTime")) || 0;
const resetInterval = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

// Check if leaderboard should be reset
if (Date.now() - lastResetTime > resetInterval) {
  leaderboard = []; // Reset leaderboard if 3 days have passed
  localStorage.setItem("lastResetTime", Date.now());
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Event listener for controlling the snake via arrow buttons
document.getElementById('up').addEventListener('click', () => startGame('UP'));
document.getElementById('down').addEventListener('click', () => startGame('DOWN'));
document.getElementById('left').addEventListener('click', () => startGame('LEFT'));
document.getElementById('right').addEventListener('click', () => startGame('RIGHT'));

// Main game loop
function gameLoop() {
  if (gameOver) {
    alert(`Game Over! Your score: ${score}`);
    saveScore();
    resetGame();
    return;
  }

  updateSnake();
  checkCollisions();
  draw();
  setTimeout(gameLoop, 100); // Update game every 100ms
}

// Update the snake position
function updateSnake() {
  let head = { ...snake[0] };

  if (direction === 'UP') head.y -= gridSize;
  if (direction === 'DOWN') head.y += gridSize;
  if (direction === 'LEFT') head.x -= gridSize;
  if (direction === 'RIGHT') head.x += gridSize;

  snake.unshift(head); // Add new head to the snake

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score += 10; // Increase score
    food = spawnFood(); // Spawn new food
  } else {
    snake.pop(); // Remove tail
  }
}

// Start the game by setting the direction
function startGame(newDirection) {
  if (direction === null) { // Only start the game if it's not already moving
    direction = newDirection; // Set the initial direction
    gameLoop(); // Start the game loop
  }
}

// Draw everything on the canvas
function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas

  // Draw the snake
  ctx.fillStyle = 'green';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  // Draw the food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 10, 20);
}

// Check if the snake collides with the walls or itself
function checkCollisions() {
  const head = snake[0];

  // Check if the snake hits the walls
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    gameOver = true;
  }

  // Check if the snake collides with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
    }
  }
}

// Spawn food at a random location
function spawnFood() {
  let foodX = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  let foodY = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  return { x: foodX, y: foodY };
}

// Save the score to the leaderboard
function saveScore() {
  leaderboard.push({ name: playerName, score: score });
  leaderboard.sort((a, b) => b.score - a.score); // Sort by score, descending

  if (leaderboard.length > 5) {
    leaderboard.pop(); // Keep top 5 scores
  }

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  displayLeaderboard();
}

// Display the leaderboard
function displayLeaderboard() {
  const leaderboardTable = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
  leaderboardTable.innerHTML = ''; // Clear the table

  leaderboard.forEach(entry => {
    const row = leaderboardTable.insertRow();
    const nameCell = row.insertCell(0);
    const scoreCell = row.insertCell(1);
    nameCell.textContent = entry.name;
    scoreCell.textContent = entry.score;
  });
}

// Reset the game to the initial state
function resetGame() {
  snake = [{ x: 160, y: 160 }];
  food = spawnFood();
  direction = null; // Snake is stationary
  gameOver = false;
  score = 0;
  playerName = prompt("Enter your name for the leaderboard:");
  displayLeaderboard(); // Display leaderboard after game reset
}
