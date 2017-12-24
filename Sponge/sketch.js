function setup() {
  createCanvas(1000, 1000, WEBGL);
  boxes.push(new Box(0, 0, 0, 500));
}

var b;
var angle = 0;
var boxes = [];

function draw() {
  background(100);
  stroke(0);

  translate(0, 0, -400);
  rotateY(angle % TWO_PI);
  rotateZ(angle * 0.5 % TWO_PI);
  rotateX(angle * 0.8 % TWO_PI);
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].draw();
  }

  angle += 0.01;
}

function mousePressed() {

  for (var i = boxes.length - 1; i >= 0; i--) {
    if (!boxes[i].done) {
      var newArr = boxes[i].getSplit();
      for (var j = 0; j < newArr.length; j++) {
        boxes.push(newArr[j]);
      }
    }

    boxes.splice(i, 1);

  }

  console.log(boxes.length + " boxes!");

}


function Box(x, y, z, s) {


  this.done = false;
  this.pos = createVector(x, y, z);
  this.scale = s;
  this.draw = function () {
    push();
    fill(255);
    translate(this.pos.x, this.pos.y, this.pos.z);
    box(this.scale);
    pop();
  }

  this.getSplit = function () {
    this.done = true;
    var split = [];

    // from -1,0,1 on all axis
    for (var x = -1; x < 2; x++) {
      for (var y = -1; y < 2; y++) {
        for (var z = -1; z < 2; z++) {
          var sum = abs(x) + abs(y) + abs(z);
          var newR = this.scale / 3;

          // Only create new box on edges (only when 2 dimensions are moved)
          if (sum > 1) {
            split.push(new Box(this.pos.x + x * newR, this.pos.y + y * newR, this.pos.z + z * newR, newR));
          }
        }
      }
    }

    return split;

  }
}

