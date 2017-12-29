
function setup() {
  createCanvas(600, 400);

}

var masstab = 10;

function draw() {
  background(0);
  noFill();
  stroke(50);

  
  for(let row = 0; row < height;row+=masstab){
    line(0,row,width,row);
    
  }
  for(let col = 0; col < width;col+=masstab){
    line(col,0,col,height);
  }
  stroke(255);
  
  translate(width/2,height/2);
  beginShape();
  for(var x = -width; x < height; x+=.1){
    
    vertex(x*masstab, tan(x) );
    
    }
  endShape();

   
}

