function setup() {
  rectMode(CORNER);
  
  
  balls = [];
  edges = [];
  warningballs=[]
  canvas = new Canvas(500) 
  createCanvas(canvas.x, canvas.y);
  Lost = false;
  mov_sped = 0.25;
  
  num_ball = 5;
  edge_num = 0;

  edge_choices = [0, canvas.x];
  choices = [-1, 1];
  canvasRatio = canvas.x/400
  pints = 0;
  best = 0;

  
  //Ball Spawner Timer
  const interval = setInterval(() => {

    warningballs.push(new Ball(random(width),random(height),random(10),random(10),random(25, 100),random(choices),random(choices)));
   
    setTimeout(() => {
      balls.push(new Ball(warningballs[0].x,warningballs[0].y,random(10),random(10),warningballs[0].width,random(choices),random(choices)));
      warningballs.length = 0
    },1000);
      
    pints += 1;
    

    
    
    if (pints % 5 == 0) {
      edges.push(new Edgesweeper(random(edge_choices), random(edge_choices), canvas.x));
    }
    
  }, 2500);




  //Make New Player, Set Its Speed to 10x Balls
  player = new Player(mov_sped * 10, canvas, canvasRatio);

  //Make New Edgesweeper (0)
  for (i = 0; i < edge_num; i++) {
    edges.push(new Edgesweeper(random(edge_choices), random(edge_choices)), canvas.x);
  }
  //Make New Balls (5)
  for (i = 0; i < num_ball; i++) {
    balls.push(new Ball(random(width),random(height),random(10 * canvasRatio),random(10 * canvasRatio),random(25*canvasRatio, 100*canvasRatio),random(choices),random(choices)));
  }
}

//Canvas Information
class Canvas{
  constructor(x){
    this.x = x;
    this.y = x;
  }
} 

//Edge Sweeper Information
class Edgesweeper {
  constructor(x, y, canvas) {
    this.canvas = canvas
    this.speed = random(1, 2);
    this.size = 30;
    this.x = x;
    this.y = y;
    this.x_mov = 0;
    this.y_mov = 0;
  }
  //Draw Function For Edge Sweeper
  draw() {
    fill("blue");
    circle(this.x, this.y, this.size);
    fill("white");
  }
  //Move Function For Edge Sweeper
  move() {
    if (this.x <= 0 && this.y <= 0) {
      this.x_mov = +5;
      this.y_mov = 0;
    }
    if (this.x >= this.canvas && this.y <= 0) {
      this.x_mov = 0;
      this.y_mov = +5;
    }
    if (this.x <= this.canvas && this.y >= this.canvas) {
      this.x_mov = -5;
      this.y_mov = 0;
    }
    if (this.x <= 0 && this.y >= this.canvas) {
      this.x_mov = 0;
      this.y_mov = -5;
    }

    this.x += this.x_mov;
    this.y += this.y_mov;
  }
}

//PLayer Information
class Player {
  constructor(mov_speed,canvas, canvasRatio) {
    this.x = canvas.x/2;
    this.y = canvas.x/2;
    this.size = 15*canvasRatio;
    this.speed = mov_speed;
    this.DashBar = 100;
    this.DashReload = false;
  }
  //Draw Function For Player
  draw() {
    fill("red");
    circle(this.x, this.y, this.size);
    fill("white");
  }
  dash_draw() {
    fill("white");
    rect(player.x-13,player.y+15,25,10);
    fill("red");
    rect(player.x-13,player.y+15,25*player.DashBar/100,10);
    fill("black");
    textSize(32);
  }
}

//Ball Information
class Ball {
  constructor(x, y, x_multi, y_multi, wide, x_mo, y_mo) {
    this.x = x;
    this.x_mo = x_mo;
    this.x_multi = x_multi;

    this.y = y;
    this.y_mo = y_mo;
    this.y_multi = y_multi;
    this.width = wide;
  }
  //Draw Function For Player
  draw() {
    
    circle(this.x, this.y, this.width);
  }
}

//Defines Movement For player 
function playerMove(player, mov_sped, canvas) {

  //Spacebar Dash
  if (keyIsDown(32) == true && player.DashBar > 0 && player.DashReload == false){
    player.speed = (mov_sped*10)*3;
    player.DashBar -= 2;
    
        
  }
  if (keyIsDown(32) == false || player.DashBar <= 0){
    player.speed = (mov_sped*10);
    player.DashReload = true;
    if (player.DashBar < 100){
        player.DashBar += 5;
    }
    if (player.DashBar >= 100){
      player.DashReload = false
    }
  }
  
  //WASD Movement
  if (keyIsDown(65) && player.x > 0 - player.size) {
    player.x -= player.speed; //Left
  }
  if (keyIsDown(68) && player.x < canvas.x) {
    player.x += player.speed; // Right
  }
  if (keyIsDown(87) && player.y > 0 - player.size) {
    player.y -= player.speed; //Up
  }
  if (keyIsDown(83) && player.y < canvas.x) {
    player.y += player.speed; //Down
  }
  if (player.x > canvas.x - player.size / 2) {
    player.x = canvas.x - player.size / 2;
  }
  if (player.x < 0 + player.size / 2) {
    player.x = 0 + player.size / 2;
  }
  if (player.y > canvas.x - player.size / 2) {
    player.y = canvas.x - player.size / 2;
  }
  if (player.y < 0 + player.size / 2) {
    player.y = 0 + player.size / 2;
  }
  
}

//Test If Balls Collide With PLayer
function testballs(balls, canvas) {
  for (i = 0; i < balls.length; i++) {
    if (balls[i].x > canvas.x - balls[i].width / 2) {
      balls[i].x_mo = -1;
    }

    if (balls[i].x < balls[i].width / 2) {
      balls[i].x_mo = 1;
    }

    if (balls[i].y < balls[i].width / 2) {
      balls[i].y_mo = 1;
    }

    if (balls[i].y > canvas.x - balls[i].width / 2) {
      balls[i].y_mo = -1;
    }
  }
}

//What To Do If Player Lost
function lose(player, balls, edges, canvas) {
  balls.length = 0;
  edges.length = 0;
  player.DashBar = 100;
  player.DashReload = false;

  //Re-Draw Edge-Sweeper
  for (i = 0; i < edge_num; i++) {
    edges.push(new Edgesweeper(random(edge_choices), random(edge_choices), canvas.x));
  }
  //Re-Draw Balls
  for (i = 0; i < num_ball; i++) {
    balls.push(new Ball(random(width),random(height),random(10 * canvasRatio),random(10 * canvasRatio),random(25*canvasRatio, 100*canvasRatio),random(choices),random(choices)));
  }
  player.x = canvas.x/2;
  player.y = canvas.x/2;

  Lost = false;
}

//Basically While Loop
function draw() {
  background(220);
  player.draw();
  player.dash_draw();
  playerMove(player, mov_sped, canvas);
  testballs(balls, canvas);
  fill("black")
  text(best, canvas.x - 30*canvasRatio, 30*canvasRatio);
  text(pints, 10*canvasRatio, 30*canvasRatio);
  fill("white");

  for (i=0; i < warningballs.length; i++){
    fill("orange")
    warningballs[i].draw()
    fill("white")
  }


  for (i = 0; i < edges.length; i++) {
    edges[i].draw();
    edges[i].move();
    if (
      dist(player.x, player.y, edges[i].x, edges[i].y) <
      player.size / 2 + edges[i].size / 2
    ) {
      Lost = true;
    }
  }
  
  for (i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].x += mov_sped * balls[i].x_mo * balls[i].x_multi;
    balls[i].y += mov_sped * balls[i].y_mo * balls[i].y_multi;
    if (
      dist(player.x, player.y, balls[i].x, balls[i].y) <
      (player.size + balls[i].width) / 2
    ) {
      Lost = true;
    }
  }
  
  if (Lost == true) {
    lose(player, balls, edges,canvas);
    if (pints > best) {
      best = pints;
    }
    pints = 0;
  }
}
