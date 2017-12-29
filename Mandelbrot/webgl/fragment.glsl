precision highp float;

uniform vec2 dimension;
uniform float minR;
uniform float maxR;
uniform float minI;
uniform float maxI;


float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {

  float a = map(gl_FragCoord.x,0.0,dimension.x,minR,maxR);
  float b = map(gl_FragCoord.y,0.0,dimension.y,minI,maxI);
  float initialA = a;
  float initialB = b;

 
  float n = 0.0;
  float maxIterations = 10000.0;
  const int maxIterations_int = 10000;

  for(int i = 0; i < maxIterations_int;i++){
    
    float newA = a*a - b*b;
    float newB = 2.0*a*b;

    a = initialA + newA;
    b = initialB + newB;

    if(abs(a+b)>4.0){
      break;
    }
   
    n += 1.0;
  }

  if(n >= maxIterations){
    discard;
  }else{
    float normalized =  map(n, 0.0, maxIterations,0.0,1.0);
    float bri = map(sqrt(normalized*50.0),0.0,1.0,0.0,1.0);
    gl_FragColor = vec4(
      map(bri*n*2.4,0.0,200.0,0.0,1.0),
      map(bri*n,0.0,130.0,0.0,1.0),
      map(bri, 0.0,3.0,0.0,1.0),
      1.0);
  }


}
