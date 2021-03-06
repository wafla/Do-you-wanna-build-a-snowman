//방향 키를 누르면 눈이 바람에 날리는 것처럼 변경했습니다.
//class Snow의 move 부분을 수정헀습니다.

var cols, rows;               //terrain variables
var scl = 20;
var w = window.innerWidth*3;
var h = window.innerHeight*2.5;
var terrain = [];
var flying = 0;
var flying2 = 0;              //add flying2
let sx=w/2;                   //ball variables
let sy=h/2;
let ball=100;
let temp1=0;
let temp2=0;


var num = 500;
let xa;
let xb;
let xz;
let snow = [];
let c, r, g;                  //color variables
let time = 0, timespeed=0.3;


function setup() {
  createCanvas(window.innerWidth-100, window.innerHeight-50, WEBGL);
  cols = w / scl;
  rows = h / scl;

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }

//sliders
  xa = createSlider(-1000, 1000, 350);
  xb = createSlider(-800, 800, 300);
  xz = createSlider(-800, 800, -100);

  for (let i = 0; i < num; i++)
    snow.push(new Snow());
}

function draw() {
//camera
  let vx = map(xa.value(), 0, width, -800, 800);
  let vy = map(0, xb.value(), height, 100, 800);
  let vz = map(xz.value(), 0, height/2, -800, 800);
  camera(vx, vy, vz, 0, 0, 0, 0, 1, 0);

  var yoff = temp1;
  for (var y = 0; y < rows; y++) {
    var xoff = temp2;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
      xoff += 0.2;
    }
    yoff += 0.2;
  }


  background(0);
  translate(0, 50);
  rotateX(PI*0.4);
  fill(200, 200, 200, 150);
  
  //terrain
  translate(-w / 2, -h / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      c = terrain[x][y];          //terrain color
      c = map(c, -100, 100, 0, 255);
      r = c-20 + time;
      g = c+30 + time/2;
      b = c-20  + time;
      fill(r, g, b);
      noStroke();
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
  
  //snow
  for (var x=0; x<num; x++)
  {
    snow[x].move();
    snow[x].display();
  }
  
  
  if (time<70)
    time += timespeed;
    
  push();
  ambientLight(160);                      //light
  pointLight(255, 255, 255, 0, -5000, 0); //deleted mouse variables
  specularMaterial("White");
  shininess(150);
  translate(sx, sy, ball);                //ball
  sphere(ball);
  keyPressed();
  pop();
}
let size_ = 1000;//원래 지형 크기 안에서만 눈을 생성하면 방향 키를 눌러 눈이 움직이고 다시 생성될 때 부자연스러워서 범위를 생성되는 범위를 넓혔습니다.
class Snow {
  constructor(i, j, k) {
    this.i = random(-size_, w+size_);
    this.j = random(-size_, h+size_);
    this.k = random(400, 2000);
  }
  move() {
    let v1 = 1, v2 = 1;//방향키를 누르면 값이 변하고 x좌표인 this.i와 y좌표인 this.j에 더해서 눈이 움직이게 합니다.
    if(key=='w')
      v2 = -10;
    if(key=='s')
      v2 = 10;
    if(key=='a')
      v1 = -10; 
    if(key=='d')
      v1 = 10;
    this.i += v1;
    this.j += v2;
    this.k -= 10; 
    if (this.k<=0)
    {
        this.i = random(-size_, w+size_);
        this.j = random(-size_, h+size_);
        this.k = random(1000, 2000);
    }
  }
  display() {
    push();
    noStroke();
    translate(this.i, this.j, this.k);
    ambientLight(160);
    let locX = mouseX - width / 2;
    let locY = mouseY - height / 2;
    pointLight(255, 255, 255, locX, locY, 50);
    specularMaterial(255);
    shininess(250);
    sphere(10);
    pop();
  }
}
function keyPressed() {
  if (key == 'w') {
    ball += 0.2;
    if (sy < h)
      sy += 5;
    flying += 0.1;
    temp1 = flying;
  }
  if (key == 's') {
    ball+=0.2;
    if (sy>0)
      sy-=5;
    flying -= 0.1;
    temp1 = flying;
  }
  if (key == 'a') {
    ball+=0.2;
    if (sx<w)
      sx+=5;
    flying2 += 0.1; //temp2의 flying 값을 temp1과 분리했습니다.
    temp2 = flying2;
  }
  if (key == 'd') {
    ball += 0.2;
    if (sx>0)
      sx-=5;
    flying2 -= 0.1;
    temp2 = flying2;
  }
  if (key == 20)  //stop - spacebar
  {
    sx=sx;
    sy=sy;
  }
}
