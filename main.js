// This file contains the main game logic. It includes functions to move the circle with the mouse, detect when the space key is pressed, check for collisions between the circle and the randomly moving box, update the score, and handle the pause functionality.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseButton = document.getElementById('pauseButton');
const progressBar = document.getElementById('progressBar');

let circle = { x: 400, y: 300, radius: 10 }; // Smaller radius
let box = generateRandomBox();
let enemyBox = generateRandomBox();
let score = 0;
let isPaused = false;
let highestScore = localStorage.getItem('highestScore') || 0;
let timeLeft = 120; // Timer set to 60 seconds
let level = parseInt(localStorage.getItem('level')) || 1;
let levelProgress = parseInt(localStorage.getItem('levelProgress')) || 0;

const levelUpScore = 39;// Score needed to level up

canvas.addEventListener('mousemove', (e) => {
    if (!isPaused) {
        const rect = canvas.getBoundingClientRect();
        circle.x = e.clientX - rect.left;
        circle.y = e.clientY - rect.top;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isPaused) {
        if (isColliding(circle, box)) {
            score++;
            levelProgress++;
            localStorage.setItem('levelProgress', levelProgress);
            updateProgressBar();
            if (levelProgress >= levelUpScore) {
                localStorage.setItem('level', level);
                levelUp();
            }
            if (score > highestScore) {
                highestScore = score;
                localStorage.setItem('highestScore', highestScore);
            }
            box = generateRandomBox();
            shakeCanvas();
        } else if (isColliding(circle, enemyBox)) {
            localStorage.setItem('finalScore', score);
            window.location.href = 'menu.html';
        }
    }
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
});

function generateRandomBox() {
    return {
        x: Math.random() * (canvas.width - 20), // Adjust for smaller size
        y: Math.random() * (canvas.height - 20), // Adjust for smaller size
        width: 20, // Smaller size
        height: 20 // Smaller size
    };
}

function isColliding(circle, box) {
    const distX = Math.abs(circle.x - box.x - box.width / 2);
    const distY = Math.abs(circle.y - box.y - box.height / 2);

    if (distX > (box.width / 2 + circle.radius) || distY > (box.height / 2 + circle.radius)) {
        return false;
    }

    if (distX <= (box.width / 2) || distY <= (box.height / 2)) {
        return true;
    }

    const dx = distX - box.width / 2;
    const dy = distY - box.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

function drawCircle() {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.closePath();
}

function drawBox(box, color) {
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Highest Score: ${highestScore}`, 10, 60);
    ctx.fillText(`Time Left: ${timeLeft}s`, 10, 90);
    ctx.fillText(`Level: ${level}`, 10, 120);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    drawBox(box, '#e74c3c');
    drawBox(enemyBox, '#2ecc71');
    drawScore();
    if (!isPaused) {
        requestAnimationFrame(gameLoop);
    }
}

function shakeCanvas() {
    canvas.classList.add('shake');
    setTimeout(() => {
        canvas.classList.remove('shake');
    }, 500); // Duration of the shake animation
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                localStorage.setItem('finalScore', score);
                window.location.href = 'menu.html';
            }
        }
    }, 1000);
}

function updateProgressBar() {
    const progress = (levelProgress / levelUpScore) * 100;
    progressBar.style.width = `${progress}%`;
}

function levelUp() {
    level++;
    levelProgress = 0;
    updateProgressBar();
    localStorage.setItem('level', level);
    localStorage.setItem('levelProgress', levelProgress);

    // Display level up message or unlock new features or challenges
    
    // Increase difficulty (e.g., reduce box size, increase speed, etc.)
}

setInterval(() => {
    if (!isPaused) {
        box = generateRandomBox();
        enemyBox = generateRandomBox();
    }
}, 1000);

startTimer();
gameLoop();