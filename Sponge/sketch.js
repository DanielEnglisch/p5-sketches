function setup() {
  createCanvas(500,500, WEBGL);
  boxes.push(new Box(0,0, 300));
}

var b;
var angle = 0;
var boxes = [];

function draw(){
  background(100);
	noStroke();

	  noFill();
	  stroke(255);
  push();
    translate(0, 0, -400);
    rotateY(angle % TWO_PI);
    rotateZ(angle*0.5 % TWO_PI);
    rotateX(angle*0.8 % TWO_PI);

	  for(var i = 0; i < boxes.length; i++){
      boxes[i].draw();
    }
  pop();
  
  angle+=0.01;
}

function mousePressed(){

  for(var i = boxes.length-1; i > 0; i--){
    boxes[i].getSplit().foreach(function(o){
      boxes.push(o);
      console.log(o);
    });
  }

  console.log(boxes.length);
  
}


function Box(x,y,s){
  this.pos = createVector(x,y);
  this.scale = s;
  this.draw = function(){
    box(this.scale, this.scale, 0,this.pos.x, this.pos.y,
    );
  }

  this.getSplit = function(){

      var split = [];
      split.push(new Box(this.pos.x, this.pos.y,this.scale/3));
      return split;


  }
}

