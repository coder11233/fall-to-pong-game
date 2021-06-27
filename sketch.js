var leftWall,rightWall,topWall;
var gameOver,restart;
var leftWallGroup,rightWallGroup;
var ball, ball_img;
var invisibleLeftEdge, invisibleRightEdge;
var flag="fall";
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var wallSpeed=-2;
var gameStatePong = "serve";
  
var score=0;


function preload(){
  ball_img = loadImage("redBall.png");
}

function setup()
 {
  createCanvas(400,500);
if(flag==="fall")
{
  ball=createSprite(200,100,10,10);
  ball.addImage(ball_img);
  ball.scale= 0.14;

  topWall=createSprite(200,0,400,5);
  topWall.visible= false;

  invisibleLeftEdge = createSprite(0,200,2,700);
  invisibleLeftEdge.visible = false;
  //invisibleLeftEdge.shapeColor = "black";

  invisibleRightEdge = createSprite(400,200,2,700);
  invisibleRightEdge.visible = false;
  //invisibleRightEdge.shapeColor = "black";

 leftWallGroup=new Group();
 rightWallGroup=new Group();

 ball.setCollider("circle", 0,0, 90);
}
if(flag==="pong")
{

  //create a user paddle sprite
  userPaddle = createSprite(390,250,10,70);
  
  //create a computer paddle sprite
  computerPaddle = createSprite(10,250,10,70);
  
  //create the pong ball
  ball = createSprite(200,250,12,12);
  
  computerScore = 0;
  playerScore = 0;
  gameStatePong = "serve";
  
}
}

function endFall()
{
  score=leftWallGroup.length-8;
  alert( "Score : "+score);
  leftWallGroup.destroyEach();
  rightWallGroup.destroyEach();
  ball.destroy();
  topWall.destroy();
  invisibleLeftEdge.destroy();
  invisibleRightEdge.destroy();
}


function draw() 
{
    background(255)

    if(flag==="fall")
    {
      fall();
      if(ball.isTouching(topWall))
      {
        endFall();
        flag="pong";
        background("white");
        setup();
      }
   
    }
    if(flag==="pong")
    {
      pong();
      if (gameStatePong === "over") {
        text("Game Over!",170,160);
//        text("Press 'R' to Restart",150,180);
      }
        
    }
    edges=createEdgeSprites();
    drawSprites();
}
  
function spawnWalls(){
  
   
    if(frameCount%40===0){
      var randomWidth = random(50,300)
    leftWall= createSprite(randomWidth/2, 600, randomWidth,20);
    leftWall.shapeColor = "black";
    leftWall.velocityY = wallSpeed;
  
    rightWall=createSprite(randomWidth+40+(400-40-randomWidth)/2, leftWall.y, 400-40-randomWidth,20);
    rightWall.shapeColor = "black";
    rightWall.velocityY =leftWall.velocityY;


  leftWallGroup.add(leftWall);
  rightWallGroup.add(rightWall);
}
 }

 function fall()
 {
     ball.collide(invisibleLeftEdge);
     ball.collide(invisibleRightEdge);
  
     if(gameState===PLAY)
     {

        ball.velocityY = 4;
        if(keyDown(LEFT_ARROW))
        {
          ball.x -= 8;
        }

        if(keyDown(RIGHT_ARROW))
        {
          ball.x += 8;
        }
        spawnWalls();
      
        if(leftWallGroup.isTouching(ball)){
          ball.collide(leftWallGroup);
          ball.setVelocity(0,0);
        }
  
        if(rightWallGroup.isTouching(ball)){
          ball.collide(rightWallGroup);
          ball.setVelocity(0,0);
        }

       }
    }
 function pong()
 {
  background("white")
  text(computerScore,170,20);
  text(playerScore, 230,20);

  //draw dotted lines
  for (var i = 0; i < 500; i+=20) {
     line(200,i,200,i+10);
  }

  if (gameStatePong === "serve") {
    text("Press Space to Serve",150,180);
  }


  if (keyDown("r")) {
    gameStatePong = "serve";
    computerScore = 0;
    playerScore = 0;
  }

  if (computerScore=== 5 || playerScore === 5){
    gameStatePong = "over";
  }

  //give velocity to the ball when the user presses play
  //assign random velocities later for fun
  if (keyDown("space") && gameStatePong == "serve") {
    ball.velocityX = 5;
    ball.velocityY = 5;
    gameStatePong = "play";
  }

  //make the userPaddle move with the mouse
  userPaddle.y = World.mouseY;



  //make the ball bounce off the user paddle
  if(ball.isTouching(userPaddle)){
    //hitSound.play();
    ball.x = ball.x - 5;
    ball.velocityX = -ball.velocityX;
  }

  //make the ball bounce off the computer paddle
  if(ball.isTouching(computerPaddle)){
    //hitSound.play();
    ball.x = ball.x + 5;
    ball.velocityX = -ball.velocityX;
  }

  //place the ball back in the centre if it crosses the screen
  if(ball.x > 400 || ball.x < 0){
    //scoreSound.play();

  if (ball.x < 0) {
      playerScore++;
    }
    else {
      computerScore++;
    }

    ball.x = 200;
    ball.y = 250;
    ball.velocityX = 0;
    ball.velocityY = 0;
    gameStatePong = "serve";

  }

  //make the ball bounce off the top and bottom walls
  if (ball.isTouching(edges[2]) || ball.isTouching(edges[3])) {
    ball.bounceOff(edges[2]);
    ball.bounceOff(edges[3]);
   // wall_hitSound.play();
  }

  //add AI to the computer paddle so that it always hits the ball
  computerPaddle.y = ball.y;

 }