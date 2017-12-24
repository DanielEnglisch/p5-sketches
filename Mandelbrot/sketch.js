// Input settings
//var dx = -0.7453;
//var dy = 0.1127;
//var minR = - 6.5E-4;

var dx = 0;
var dy = 0;
var minR = -2;

var maxIterations = 1000;


var maxR = -minR;
  

function setup() {
  createCanvas(1000,1000);
  pixelDensity(1);
  loadPixels();  

  calculate(); 

}


function calculate() {
  // For every pixel
  for(var x = 0; x < width; x++){
    for(var y = 0; y < height; y++){
      
      
      // Memory mapping
      var pix = (x+y*width)*4;

      // Map pixel position between minR and maxR
      var a = map(x,0,width,minR,maxR);
      var b = map(y,0,height,minR,maxR);
      a+=dx;
      b+=dy;
      var n = 0;
      var initialA = a;
      var initialB = b;

      // Iterate
      for(var n = 0; n < maxIterations;n++){
        // Apply mandelbrot formula
        var newA = a*a - b*b;

        var newB = 2*a*b;

        a = initialA + newA;
        b = initialB + newB;

        // If it gets towards infinity
        if(abs(a + b) > 16)
          break;
      }

      // Map iterations to brightness
        //var brightness = map(n,0,100,0,255);
        //var brightness = n*6 %255;
      // Normalize
      var brightness = map(n,0,maxIterations,0,1);
      // Map to sqrt(brightness) function
      brightness = map(sqrt(brightness),0,1,0,255);

      // Ignore infinite values
      if(n === maxIterations)
          brightness = 0;
       

      // RGBA Values of pixel
      pixels[pix+0] = brightness - 0.5*n % 255;
      pixels[pix+1] = brightness + n % 255;
      pixels[pix+2] = brightness * 1.2 % 255;
      pixels[pix+3] = 255 - 0.5 * n   %255;

      
      
    }
  }
  updatePixels();
  

}