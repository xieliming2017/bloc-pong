var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");

var startGameMessage = document.getElementById('startGameMessage');
var startGameMessageH3 = startGameMessage.querySelector("h3");

function GameField(){
  this.width = 500;
  this.height = 375;
}
//create a game field of 500 x 375
GameField.prototype.render = function(){
  for (var y = 0; y <= 365; y+=20){
    context.moveTo(250, y)
    context.lineTo(250, y+10)
  }
  context.stroke();

  context.beginPath();
  context.moveTo(0,0)
  context.lineTo(500,0)
  context.lineTo(500,375)
  context.lineTo(0,375)
  context.lineTo(0,0)

  context.stroke();
}

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height
  this.speed = 0;
}

  Paddle.prototype.render = function(){
    context.beginPath();
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = 'black';
    context.fill();
  }

//paddle's move pattern
Paddle.prototype.move = function(direction){
  clearCanvas();
  if(direction == "up"){
    if(this.y < this.speed){//paddle reaches the top
      this.y = 0;
    } else {
      this.y -= this.speed;
    }
  }
  else if (direction == "down") {
    if((375-this.y-this.height) < this.speed){//paddle reaches the buttom
      this.y = 375-this.height;
    } else {
      this.y += this.speed;
    }
  }
}

function Ball(x, y){
  this.x = x;
  this.y = y;
  this.speed_x = 0;
  this.speed_y = 0;
}

Ball.prototype.render = function(){
  context.beginPath();
  context.arc(this.x, this.y, 10, 0, 2*Math.PI, false);
  context.fillStyle = 'black';
  context.fill();
}

//ball's move pattern
Ball.prototype.move = function(){
  clearCanvas();
  this.x += this.speed_x;
  this.y += this.speed_y;

//1. Ball hits the top or buttom side of the box
  if(this.y <= 10 || this.y >=365){
    this.speed_y *= -1;
  }

//2. Ball hits the left or right side of the box
  if(this.x >= 490){//player lose
    score.computerScore += 1;
    initialize();
  }

  if(this.x <= 10){//computer lose
    score.playerScore += 1;
    initialize();
  }

  //3. Ball hits player paddle
  if(this.x >= player.x - 10 && player.y <= this.y && this.y <= player.y + 75 && this.speed_x > 0){
    this.speed_x *= -1;
  }

  //3. Ball hits computer paddle
  if(this.x <= computer.x +30 && computer.y <= this.y && this.y <= computer.y + 75 && this.speed_x < 0){
    this.speed_x *= -1;
  }
}

function Score(){
  this.playerScore= 0;
  this.computerScore = 0;
}

Score.prototype.render = function(){
  context.font = "30px Arial";
  context.fillText(this.computerScore, 120, 30);
  context.fillText(this.playerScore, 370, 30);
  if(this.computerScore == 5){
    startGameMessageH3.innerText = "You Lose\nPress SPACE to restart";

  }else if (this.playerScore == 5) {
    startGameMessageH3.innerText = "You Win\nPress SPACE to restart";

  }
}

var gameField = new GameField();
var player = new Paddle(470, 150, 20, 75);
var computer = new Paddle(15, 150, 20, 75);
var ball = new Ball(250, 187.5);
var gameStarted = false;
var score = new Score();

var animate = window.requestAnimationFrame ||
              function(callback) { window.setTimeout(callback, 1000/60) };

var step = function(){
  // if(score.playerScore == 5 || score.computerScore == 5){
  //   initialize();
  // }
  ball.move();
  //computer paddle try to move to catch the ball
  if(ball.y < computer.y){
    computer.move("up");
  }
  if(ball.y > computer.y+75){
    computer.move("down");
  }

  renderGameElements();
  animate(step);
}

//reset positions and speeds of paddles and ball
var initialize = function(){
  computer.speed = 0;
  computer.x = 15;
  computer.y = 150;

  player.speed = 0;
  player.x = 470;
  player.y = 150;

  ball.x = 250;
  ball.y = 187.5;
  ball.speed_x = 0;
  ball.speed_y = 0;

  gameStarted = false;
  startGameMessage.style.display = "block";

}

var startGame = function(){
  if(gameStarted == false){
    computer.speed = 1.6;
    player.speed = 20;
    ball.speed_x = 3.5;
    ball.speed_y = -1.5;
    gameStarted = true;
  }
}

var endGame = function(){
  initialize();
  clearCanvas();
  renderGameElements();
}

var clearCanvas = function(){
  context.clearRect(0, 0, gameField.width, gameField.height);
}

var renderGameElements = function(){
  computer.render();
  player.render();
  ball.render();
  gameField.render();
  score.render();
}

window.onload = function(){
  renderGameElements();

  document.addEventListener('keydown', function(event) {
      if(event.keyCode == 38 && gameStarted){
        player.move("up");
      }
      else if (event.keyCode == 40 && gameStarted) {
        player.move("down");
      }
  }, false);

  document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32 && !gameStarted){
      startGameMessage.style.display = "none";
      if(score.playerScore == 5 || score.computerScore == 5){
        score.playerScore = 0;
        score.computerScore = 0;
        startGameMessageH3.innerText = "Press SPACE to restart";
        gameStarted = false;
      }
      startGame();
    }
  }, false);

  step();
}
