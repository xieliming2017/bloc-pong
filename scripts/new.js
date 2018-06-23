var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");
var upPressed = false;
var downPressed = false;
var gameStarted = false;
var gamePaused = false;
var gameReseted = false;
var gameEnded = false;
var player = new Player();
var computer = new Computer("beginner");
var ball = new Ball();
var pausedPlayerSpeed = 0;
var pausedComputerSpeed = 0;
var pausedBallVX = 0;
var pausedBallVY = 0;
var animate = window.requestAnimationFrame ||
              function(callback) { window.setTimeout(callback, 1000/60) };

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 38) {
        upPressed = true;
    }
    else if(e.keyCode == 40) {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 38) {
        upPressed = false;
    }
    else if(e.keyCode == 40) {
        downPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeY = e.clientY - canvas.offsetTop;
    if(relativeY > player.paddle.height/2 && relativeY < canvas.height - player.paddle.height/2) {
        player.y = relativeY - player.paddle.height/2;
    }
}

function Paddle(x, y){
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 80;
}

function Player(){
    this.paddle = new Paddle(470, 120);
    this.score = 0;
    this.speed = 0;
    this.update = function(){
        if(upPressed && this.paddle.y > 0){
            this.paddle.y -= this.speed;
        }else if(downPressed && this.paddle.y < canvas.height - this.paddle.height){
            this.paddle.y += this.speed;
        }
    }
}

function Computer(level){
    this.paddle = new Paddle(0, 120);
    this.score = 0;
    this.level = level;

    this.setLevel = function(){
        if(this.level = "beginner"){
            this.speed = 3;
        }else if (this.level = "intermediate") {
            this.speed = 4;
        }else if (this.level = "expert") {
            this.speed = 5;
        }
    }

    this.update = function(){
        if(ball.y< this.paddle.y && this.paddle.y > 0){
            this.paddle.y -= this.speed;
        } else if (ball.y > this.paddle.y + this.paddle.height && this.paddle.y < canvas.height - this.paddle.height) {
            this.paddle.y += this.speed;
        }
    }
}

Paddle.prototype.render = function(){
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function Ball(){
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.radius = 10;
    this.vX = 0;
    this.vY = 0;

    this.randomBallSpeed = function(){
        var arr = [1,-1];
        var randX = arr[Math.floor(Math.random() * 2)];
        var randY = arr[Math.floor(Math.random() * 2)];

        this.vX = 3*randX;
        this.vY = 4*randY*Math.random();
    }
}

Ball.prototype.render = function(){
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function startGame(){
    gameStarted = true;
    gameEnded = false;
    player.speed = 7;
    player.score = 0;
    computer.setLevel();
    computer.score = 0;
    ball.randomBallSpeed();
}

function pauseGame(){
    pausedPlayerSpeed = player.speed;
    pausedComputerSpeed = computer.speed;
    pausedBallVX = ball.vX;
    pausedBallVY = ball.vY;
    player.speed = 0;
    computer.speed = 0;
    ball.vX = 0;
    ball.vY = 0;
    gamePaused = true;
}

function resumeGame(){
    if(gameReseted === true){
        player.speed = 7;
        computer.setLevel();
        ball.randomBallSpeed();
    }else if (gamePaused === true) {
        player.speed = pausedPlayerSpeed;
        computer.speed = pausedComputerSpeed;
        ball.vX = pausedBallVX;
        ball.vY = pausedBallVY;
    }
    gamePaused = false;
    gameReseted = false;
}

function resetGame(){
    ball.vX = 0;
    ball.vY = 0;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    computer.paddle.y = 120;
    computer.speed = 0;
    player.paddle.y = 120;
    player.speed = 0;
    gameReseted = true;
}

function endGame(){
    ball.vX = 0;
    ball.vY = 0;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    computer.paddle.y = 120;
    computer.speed = 0;
    player.paddle.y = 120;
    player.speed = 0;
    gameStarted = false;
    gamePaused = false;
    gameReseted = false;
    gameEnded = true;
}

function drawScore(){
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText(computer.score, 80, 20);
    context.fillText(player.score, 400, 20);
}

function drawMenu(){
    var txt1 = "BLOC PONG";
    var txt2 = "Press SPACE to start";
    context.font = "48px Arial";
    context.fillStyle = "#0095DD";
    var txtX1 = (canvas.width-context.measureText(txt1).width)/2;
    context.fillText(txt1, txtX1, 150);

    context.font = "24px Arial";
    var txtX2 = (canvas.width-context.measureText(txt2).width)/2;
    context.fillText(txt2, txtX2, 280);
}

function drawPause(){
    var txt1 = "GAME PAUSED";
    var txt2 = "Press SPACE to continue";
    context.font = "48px Arial";
    context.fillStyle = "#0095DD";
    var txtX1 = (canvas.width-context.measureText(txt1).width)/2;
    context.fillText(txt1, txtX1, 150);

    context.font = "24px Arial";
    var txtX2 = (canvas.width-context.measureText(txt2).width)/2;
    context.fillText(txt2, txtX2, 280);
}

function drawReset(){
    var txt1 = "Computer: "+ computer.score + "    Player: " + player.score;
    var txt2 = "Press SPACE to continue";
    context.font = "24px Arial";
    context.fillStyle = "#0095DD";
    var txtX1 = (canvas.width-context.measureText(txt1).width)/2;
    context.fillText(txt1, txtX1, 100);

    context.font = "24px Arial";
    var txtX2 = (canvas.width-context.measureText(txt2).width)/2;
    context.fillText(txt2, txtX2, 280);
}

function drawEndGame(txt){
    var txt1 = txt
    var txt2 = "Press SPACE to start new game";
    context.font = "64px Arial";
    context.fillStyle = "#0095DD";
    var txtX1 = (canvas.width-context.measureText(txt1).width)/2;
    context.fillText(txt1, txtX1, 100);

    context.font = "24px Arial";
    var txtX2 = (canvas.width-context.measureText(txt2).width)/2;
    context.fillText(txt2, txtX2, 280);
}

function step(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    player.paddle.render();
    computer.paddle.render();
    ball.render();
    drawScore();

    if(!gameStarted && !gameEnded){
        drawMenu();
    }else if (gamePaused) {
        drawPause();
    }else if (gameReseted) {
        drawReset();
    }else if (gameEnded){
        if(player.score ===5){
            drawEndGame("YOU WIN");
        } else if (computer.score === 5) {
            drawEndGame("YOU LOSE");
        }
    }

    if(ball.y + ball.vY > canvas.height - ball.radius || ball.y + ball.vY < ball.radius){
        ball.vY = -ball.vY;
    }
    if(ball.x + ball.vX < ball.radius){
        if(ball.y > computer.paddle.y && ball.y < computer.paddle.y + computer.paddle.height){
            ball.vX = -ball.vX;
        } else{
            player.score += 1;
            if(player.score === 5){
                endGame();
            }else {
                resetGame();
            }
        }
    } else if (ball.x + ball.vX > canvas.width - ball.radius) {
        if(ball.y > player.paddle.y && ball.y < player.paddle.y + player.paddle.height){
            ball.vX = -ball.vX;
            if(upPressed){
                ball.vY += 2;
            }else if (downPressed) {
                ball.vY -= 2;
            }
        } else{
            computer.score +=1;
            if(computer.score === 5){
                endGame();
            }else {
                resetGame();
            }
        }
    }

    player.update();
    computer.update();

    ball.x += ball.vX;
    ball.y += ball.vY;

    animate(step);
}

window.onload = function(){
    document.addEventListener('keydown', function(event){
        if(event.keyCode == 32){
            if(!gameStarted || gameEnded){
                startGame();
            }else if(!gamePaused && !gameReseted){
                pauseGame();
            }else if(gamePaused || gameReseted){
                resumeGame();
            }
        }
    }, false);
    step();
}
