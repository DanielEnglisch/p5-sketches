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

  vec2 c = vec2(
    gl_FragCoord.x * (maxR-minR) / dimension.x + minR,
    gl_FragCoord.y * (maxI-minI) / dimension.y + minI
  );

  vec2 z = c;
  float iterations = 0.0;
  float maxIterations = 10000.0;
  const int maxIterations_int = 10000;

  for(int i = 0; i < maxIterations_int;i++){
    float t = 2.0 * z.x * z.y +c.y;
    z.x = z.x*z.x-z.y*z.y+c.x;
    z.y = t;

    if(z.x*z.x + z.y*z.y > 4.0){
      break;
    }
    iterations += 1.0;
  }

  if(iterations == maxIterations){
    discard;
  }else{
    float normalized =  map(iterations, 0.0, maxIterations,0.0,1.0);
    float bri = map(sqrt(normalized),0.0,1.0,0.0,1.0);
    gl_FragColor = vec4(
      map(2.0*bri,0.0,2.0,0.0,1.0),
      map(3.0*bri,0.0,3.0,0.0,1.0),
      map(4.0*bri,0.0,4.0,0.0,1.0),
      1.0);
  }


}
