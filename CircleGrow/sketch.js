var circles = [];

function setup() {
  createCanvas(500, 500);

  circles.push( new Circle(width/2,height/2));
}


function draw() {
  background(0);
  noFill();
  stroke(255);

  for(var i = 0; i < circles.length; i++){
    circles[i].grow();
    circles[i].draw();
  }

  createNewCircle();
  
}

function createNewCircle(){
  var x = random(0,width);
  var y = random(0,height);

  if(x <= 0 || x >= width || y <= 0 || y >= height)
    return;

  var success = true;
  for(var i = circles.length-1; i >= 0; i--){
    if(circles[i].intersectsPoint(x,y))
      success = false;
  }

  if(success){
    circles.push(
      new Circle(x,y)
    );

  }
  
  
}

function Circle(x,y){
  this.pos = createVector(x,y);
  this.r = 1;
  this.draw = function(){
    stroke(map(this.pos.x,0,width,0,255),map(this.pos.y,0,height,0,255),map(this.pos.x+2,0,width,0,255));
    ellipse(this.pos.x, this.pos.y, this.r,this.r);
  }
  this.grow = function(){

    if(this.pos.x-this.r+1 <= 0 || this.pos.x+this.r+1 >= width || this.pos.y-this.r+1 <= 0 || this.pos.y+this.r+1 >= height)
    return;

    var success = true;
    for(var i = circles.length-1; i >= 0; i--){

      if(this != circles[i] && circles[i].intersects(this.pos.x,this.pos.y, this.r))
        success = false;
    }

    if(success)
      this.r++;
  }
  this.intersectsPoint = function(nx,ny){
    return abs(this.pos.x -nx) < this.r && abs(this.pos.y -ny) < this.r;
  }

  this.intersects = function(nx,ny,nr){
    return Math.hypot(this.pos.x-nx, this.pos.y-ny) <= (this.r + nr);
  }

}


