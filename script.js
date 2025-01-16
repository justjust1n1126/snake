
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; 
const canvasSize = 400; 
let snake = [{ x: 160, y: 160 }]; 
let food = spawnFood(); 
let direction = null; 
let gameOver = false;
let score = 0;
let playerName = prompt("Enter your name for the leaderboard:");

let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let lastResetTime = parseInt(localStorage.getItem("lastResetTime")) || 0;
const resetInterval = 3 * 24 * 60 * 60 * 1000; 


if (Date.now() - lastResetTime > resetInterval) {
  leaderboard = []; 
  localStorage.setItem("lastResetTime", Date.now());
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}


document.getElementById('up').addEventListener('click', () => startGame('UP'));
document.getElementById('down').addEventListener('click', () => startGame('DOWN'));
document.getElementById('left').addEventListener('click', () => startGame('LEFT'));
document.getElementById('right').addEventListener('click', () => startGame('RIGHT'));


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
  setTimeout(gameLoop, 100); 
}


function updateSnake() {
  let head = { ...snake[0] };

  if (direction === 'UP') head.y -= gridSize;
  if (direction === 'DOWN') head.y += gridSize;
  if (direction === 'LEFT') head.x -= gridSize;
  if (direction === 'RIGHT') head.x += gridSize;

  snake.unshift(head); 


  if (head.x === food.x && head.y === food.y) {
    score += 20; 
    food = spawnFood(); 
  } else {
    snake.pop(); 
  }
}


function startGame(newDirection) {
  if (direction === null) { 
    direction = newDirection;
    gameLoop(); 
  }
}


function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize); 


  ctx.fillStyle = 'green';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 10, 20);
}

function checkCollisions() {
  const head = snake[0];

  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    gameOver = true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
    }
  }
}

function spawnFood() {
  let foodX = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  let foodY = Math.floor(Math.random() *
