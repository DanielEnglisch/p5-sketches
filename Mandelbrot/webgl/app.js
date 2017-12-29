var gl;
var canvas;

function main() {
  canvas = document.getElementById("gl");
  gl = initWebGL(canvas);

  var vShader = readTextFile('vertex.glsl');
  var fShader = readTextFile('fragment.glsl');


  addEvent(window, "resize", OnWindowResize);
  addEvent(window, "wheel", OnZoom);
  addEvent(window, "mousemove", OnMouseMove);


  if (gl) {


    // Vertex Shader
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vShader);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("Vertex Shader Failed " + gl.getShaderInfoLog(vs));
    }

    // Fragment Shader
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fShader);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment Shader Failed " + gl.getShaderInfoLog(fs));
    }

    // Create and Link Programm
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program failed to link " + gl.getShaderInfoLog(program))
    }

    // Validate Program
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error("Program failed to validate " + gl.getShaderInfoLog(program))
    }

    // Run Program
    gl.useProgram(program);

    // Get Uniform locations in array
    var uniformLocs = {
      dimension: gl.getUniformLocation(program, 'dimension'),
      minR: gl.getUniformLocation(program, 'minR'),
      maxR: gl.getUniformLocation(program, 'maxR'),
      minI: gl.getUniformLocation(program, 'minI'),
      maxI: gl.getUniformLocation(program, 'maxI'),

    };

    // Set Mandelbrot values
    var dim = [canvas.width, canvas.height];
    
    var minI = - 6.5E-4+ 0.1127;
    var maxI =  6.5E-4+ 0.1127;
    var minR = - 6.5E-4-0.7453;
    var maxR =  6.5E-4-0.7453;

    /*
    var minI = - 2;
    var maxI =  2;
    var minR = - 2;
    var maxR =  2;
*/
    // Create Vertices (2 Triangles)
    var vertexBuffer = gl.createBuffer();
    var vertices = [-1, 1, -1, -1,
      1, -1,

      -1, 1,
      1, 1,
      1, -1,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosAttrib = gl.getAttribLocation(program, 'vPos');
    gl.vertexAttribPointer(
      vPosAttrib,
      2, gl.FLOAT,
      gl.FALSE,
      2 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(vPosAttrib);



    var loop = function () {

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.uniform2fv(uniformLocs.dimension, dim);
      gl.uniform1f(uniformLocs.minI, minI);
      gl.uniform1f(uniformLocs.minR, minR);
      gl.uniform1f(uniformLocs.maxI, maxI);
      gl.uniform1f(uniformLocs.maxR, maxR);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    OnWindowResize();

  }

  function OnWindowResize() {

    var w = window.innerWidth;
    var h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

    dim = [canvas.width, canvas.height];

    var rRange = maxR - minR;
    maxR = (maxI - minI) * (canvas.width / canvas.height) / 1.4+ minR;
    var newRange = maxR - minR;
    minR -= (newRange - rRange) / 2;
    maxR = (maxI - minI) * (canvas.width / canvas.height) / 1.4+ minR;


    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function OnZoom(e) {
    var iRange = maxI - minI;
    var newRange;
    if (e.deltaY < 0) {
      newRange = iRange * 0.95;
    } else {
      newRange = iRange * 1.05;

    }

    var delta = newRange - iRange;

    minI -= delta / 2;
    maxI = minI + newRange;

    OnWindowResize();
  }

  function OnMouseMove(e){
    if(e.buttons === 1){
      var iRange = maxI - minI;
      var rRange = maxR - minR;

      var iDelta = (e.movementY / canvas.height) * iRange;
      var rDelta = (e.movementX / canvas.width) * rRange;

      minI += iDelta;
      maxI += iDelta;
      minR -= rDelta;
      maxR -= rDelta;

    }
  }

}



function initWebGL(canvas) {
  gl = null;

  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  } catch (e) {}


  if (!gl) {
    alert("WebGL konnte nicht initialisiert werden.");
    gl = null;
  }

  return gl;
}


function readTextFile(file) {
  var request = new XMLHttpRequest();
  request.open('GET', file, false); // `false` makes the request synchronous
  request.send(null);

  if (request.status === 200) {
    return (request.responseText);
  }
}

function addEvent(object, type, callback) {
  if (object == null || typeof (object) == 'undefined') return;
  if (object.addEventListener) {
    object.addEventListener(type, callback, false);
  } else if (object.attachEvent) {
    object.attachEvent("on" + type, callback);
  } else {
    object["on" + type] = callback;
  }
};