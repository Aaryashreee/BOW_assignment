const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const gameplayMusic = document.getElementById("gameplayMusic");
const gameOverMusic = document.getElementById("gameOverMusic");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const ROW = 4;
const ROW_WIDTH = CANVAS_WIDTH;
const ROW_HEIGHT = CANVAS_HEIGHT / ROW;

const SIZE = ROW_HEIGHT;
let isGameOver = false;

// animation character
const character = document.getElementById("character");
let player = {
    w: 80  ,
    h: SIZE,
    x: 100,
    y: Math.floor(Math.random() * (CANVAS_HEIGHT / SIZE)) * SIZE,
    speed: 0.09,
    progress: 0,
};

let obstacles = [];
let obstacleImages = [];

let score = 0;
let level = 0;
let highScore=0;
let gameOver = false;

function spawnObstacle() {
    const obstacleImage = new Image();
    obstacleImage.src = `img/bird1.png`;

    const newObstacle = {
        w: SIZE /3 ,
        h: SIZE,
        displayWidth: SIZE - SIZE * 0.5,
        displayHeight: SIZE - SIZE * 0.5,
        x: CANVAS_WIDTH + Math.floor(Math.random() * (ROW_WIDTH / SIZE)) * SIZE,
        y: 0,
        speed: 0.05  + level * 0.04,
    };
            if (newObstacle.x > CANVAS_WIDTH) {
               
                // Only change the y coordinate if the obstacle is outside the canvas
                newObstacle.y= Math.floor(Math.random() * (CANVAS_HEIGHT / SIZE)) * SIZE;
            } 
            obstacleImages.push(obstacleImage);
            obstacles.push(newObstacle);
} 

function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= SIZE * obstacles[i].speed;

        // Check if the obstacle has moved off the screen
        if (obstacles[i].x + obstacles[i].w < 0) {
            // Remove the obstacle from the array
            obstacles.splice(i, 1);
            i--; // Adjust the loop index
        }
    }

    // Spawn new obstacles randomly
    if (Math.random() < 0.02 && obstacles.length < 3) {
        spawnObstacle();
    }

}

function drawPlayer() {
    const playerImage = new Image();
     playerImage.src = `img/bug2.png `;
    let displayX = player.x ;
    ctx.drawImage(character, displayX, player.y, player.w, player.h);
    // ctx.strokeStyle = "blue";
    // ctx.strokeRect(
    //     player.x  ,
    //     player.y,
    //     player.w,
    //     player.h
    // );
}
 
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        var centerX = obstacles[i].x + obstacles[i].w / 4;
        var centerY = obstacles[i].y + obstacles[i].h / 2;

        var smallBoxX = centerX - obstacles[i].displayWidth / 2;
        var smallBoxY = centerY - obstacles[i].displayHeight / 2;

        ctx.drawImage(
            obstacleImages[i],
            smallBoxX,
            smallBoxY,
            obstacles[i].displayWidth,
            obstacles[i].displayHeight
        );

        // ctx.strokeStyle = "red";
        // ctx.strokeRect(
        //     obstacles[i].x,
        //     obstacles[i].y,
        //     obstacles[i].w,
        //     obstacles[i].h
        // );
    }
}
function drawElectricPole(x, y, height) {
    ctx.fillStyle = "brown";
    ctx.fillRect(x - 5, 0, 10, CANVAS_HEIGHT); // Pole
    ctx.fillStyle = "gray";
    ctx.fillRect(x - 15, 0, 30, height); // Crossbar

    // Draw three small circles in the upper gray part
    drawSmallCircles(x, height / 4);

    // Draw three small circles in the lower gray part
    drawSmallCircles(x, 3 * height / 4);

}

function drawSmallCircles(x, centerY) {
       // Draw three small circles in the gray part
    const circleRadius = 5;
    const circleX1 = x - 15;
    const circleX2 = x;
    const circleX3 = x + 15;

    ctx.fillStyle = "black";
    
    ctx.beginPath();
    ctx.arc(circleX1, centerY, circleRadius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(circleX2, centerY, circleRadius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(circleX3, centerY, circleRadius, 0, 2 * Math.PI);
    ctx.fill();
}


function detectWalls() {
    // left wall
    if (player.x < 0) {
        player.x = 0;
    }

    // right wall
    if (player.x + player.w > canvas.width) {
        player.x = canvas.width - player.w;
    }

    // bottom wall
    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
    }

    // top wall
    if (player.y < 0) {
        player.y = 0;
    }
}

function playGameOverMusic() {
	gameOverMusic.play();
	gameplayMusic.pause(); // Pause gameplay music
    isGameOver = true;
}

function checkCollision() {
    // Simple collision check based on bounding boxes
    const player_minx = player.x;
    const player_maxx = player.x + player.w;
    const player_miny = player.y;
    const player_maxy = player.y + player.h;

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle_minx = obstacles[i].x;
        const obstacle_maxx = obstacles[i].x + obstacles[i].w;
        const obstacle_miny = obstacles[i].y;
        const obstacle_maxy = obstacles[i].y + obstacles[i].h;

        if (
            player_minx < obstacle_maxx &&
            player_maxx > obstacle_minx &&
            player_miny < obstacle_maxy &&
            player_maxy > obstacle_miny
        ) {
            // Collision occurred, you can handle this as needed (e.g., game over)
            playGameOverMusic();
            gameOver = true;
             // Update high score
             if (score > highScore) {
                highScore = score;
            }
        } else {
            // Player successfully avoided obstacle, increase score
            score= score + 0.04;
        }
    }
    
}


function updateScoreDisplay() {
        scoreElement.innerHTML = parseInt(score);
        levelElement.innerHTML = parseInt(level);
        document.getElementById("high-score").innerHTML = parseInt(highScore);
      // Increase obstacle speed with each level
    if (score >= 100 * (level + 1)) {
        // Increase the level by 1
        level++;
        console.log("Level Up! Current Level: " + level);
    }

    }

function move(direction) {
    switch (direction) {
        case "left":
            player.x -= SIZE;
            break;
        case "right":
            player.x += SIZE;
            break;
        case "up":
            player.y -= SIZE;
            break;
        case "down":
            player.y += SIZE;
            break;
        default:
            break;
    }

    detectWalls();
}
let isJumping = false;

function jump() {
    if (!isJumping) {
        isJumping = true;
        // Adjust the y-coordinate for jumping
        player.y -= ROW_HEIGHT * 1;
        // Reset the y-coordinate after a short delay to simulate a jump
        setTimeout(() => {
            player.y += ROW_HEIGHT * 1;
            isJumping = false;
        }, 600);
    }
}

document.addEventListener("keydown", handlePlayerMovement);
function handlePlayerMovement(e) {
    if (e.key === "ArrowRight" || e.key === "d") {
        move("right");
    } else if (e.key === "ArrowLeft" || e.key === "a") {
        move("left");
    } else if (e.key === "ArrowUp" || e.key === "w") {
        move("up");
    } else if (e.key === "ArrowDown" || e.key === "s") {
        move("down");
    }else if (e.key === "Enter" ) {
        jump();
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function drawline() {
	// draw four black wire
	for (let i = 1; i <= 4; i++) {
        const centerY = i * ROW_HEIGHT - ROW_HEIGHT / 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(CANVAS_WIDTH, centerY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}


function update() {
    updateObstacles();
    updateScoreDisplay();
    checkCollision();
}

function draw() {
    clear();
    drawline();
    drawElectricPole(CANVAS_WIDTH / 30, 10, CANVAS_HEIGHT / 2);
    drawElectricPole(CANVAS_WIDTH - 20, 10, CANVAS_HEIGHT / 2);
    drawPlayer();
    drawObstacles();
  
}

function restartGame() {
    // Reset game variables
    player.x = 0;
    player.y = Math.floor(Math.random() * (CANVAS_HEIGHT / SIZE)) * SIZE;
    player.speed = 0.09;
    player.progress = 0;

    obstacles.length = 0;
    obstacleImages.length = 0;
    score = 0;
    level = 0;
    gameOver = false;

    // Remove the game over popup
    const popup = document.querySelector(".game-over-popup");
    if (popup) {
        document.body.removeChild(popup);
    }

    animate();
}
// play the music
function playGameplayMusic() {
	if (gameplayMusic.paused) {
        gameplayMusic.play();
    }
}


function animate() {
    
    playGameplayMusic();
    
        draw();
        update();
    if (gameOver === false) {
        requestAnimationFrame(animate);
    }
    else {
        // Game Over Popup
        const popup = document.createElement("div");
        popup.className = "game-over-popup";
        popup.innerHTML = `<h1>Game Over!</h1><p>Your Score: ${parseInt(score) }</p> <p>Your level: ${parseInt(level) }</p>
                             <p>High Score: ${parseInt(highScore) }</p> 
                             <button onclick="restartGame()">Restart</button>`;
        document.body.appendChild(popup);
    }
}

animate();
