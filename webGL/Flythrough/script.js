// Curran Kelleher 1/31/2013
//
// An example of a mouse-driven flythrough.
//
// Based on Ed Angel's textbook example:
// http://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SIXTH_EDITION/CODE/WebGL/CHAPTER03/chap3ex6.html

var canvas;
var gl;

var mouseDown = false;
var mouseX, mouseY;
var isRightClick;
var rotationVelocityX = 0;
var rotationVelocityY = 0;
var cameraRotationSensitivity = 1/10000;
var dampeningFactor = 0.95;

// This point is where the mouse went down
var centerX, centerY;

var X = 0;
var Y = 1;
var Z = 2;
var unitVectorZ = [0, 0, 1];
var cameraRotation = [0, 0, 0];
var cameraTranslation = [0, 0, -50];
var cameraVelocityVector = [0, 0, 0];
var cameraVelocity = 0.1;
var cameraVelocitySensitivity = 1/100;
var projection = mat4.create();
var projectionUniformId;
var perspective = mat4.create();

var pointsArray = [];
var colorsArray = [];

var vertices = new Array(8);

vertices[0] = [ -0.5, -0.5,  0.5];
vertices[1] = [ -0.5,  0.5,  0.5];
vertices[2] = [ 0.5,  0.5,  0.5];
vertices[3] = [ 0.5, -0.5,  0.5];
vertices[4] = [ -0.5, -0.5, -0.5];
vertices[5] = [ -0.5,  0.5, -0.5];
vertices[6] = [ 0.5,  0.5, -0.5];
vertices[7] = [ 0.5, -0.5, -0.5];

var vertex_colors = new Array(8);

vertex_colors[0] = [ 0.0, 0.0, 0.0, 1.0 ];  // black
vertex_colors[1] = [ 1.0, 0.0, 0.0, 1.0 ];  // red
vertex_colors[2] = [ 1.0, 1.0, 0.0, 1.0 ];  // yellow
vertex_colors[3] = [ 0.0, 1.0, 0.0, 1.0 ];  // green
vertex_colors[4] = [ 0.0, 0.0, 1.0, 1.0 ];  // blue
vertex_colors[5] = [ 1.0, 0.0, 1.0, 1.0 ];  // magenta
vertex_colors[6] = [ 1.0, 1.0, 1.0, 1.0 ];  // white
vertex_colors[7] = [ 0.0, 1.0, 1.0, 1.0 ];   // cyan

window.onload = init;

function addPoint(vertexIndex, translation){
  
  var vertex = [];
  // x, y, z
  for(i = 0; i < 3; i++)
    vertex.push(vertices[vertexIndex][i] + translation[i]);
  
  // homogenous coordinates
  vertex.push(1);
  
  pointsArray.push(vertex);
  colorsArray.push(vertex_colors[vertexIndex]);
}

function quad(a, b, c, d, translation) {
  addPoint(a, translation);
  addPoint(b, translation);
  addPoint(c, translation);
  addPoint(a, translation);
  addPoint(c, translation);
  addPoint(d, translation);
}

function color_cube(translation)
{
  quad( 1, 0, 3, 2, translation);
  quad( 2, 3, 7, 6, translation);
  quad( 3, 0, 4, 7, translation);
  quad( 6, 5, 1, 2, translation);
  quad( 4, 5, 6, 7, translation);
  quad( 5, 4, 0, 1, translation);
}

function add_cubes(){
  var n = 20, i, j, k,
      cubeSpread = n * 3,
      translation = [0, 0, 0];
  for(i = 0; i < n; i++){
    for(j = 0; j < n; j++){
      for(k = 0; k < n; k++){
        translation[X] = ( i / n - 0.5 ) * cubeSpread;
        translation[Y] = ( j / n - 0.5 ) * cubeSpread;
        translation[Z] = ( k / n - 0.5 ) * cubeSpread;
        color_cube(translation);
      }
    }
  }
}

function resizeCanvas(){
  if(!((canvas.width === window.innerWidth) && 
       (canvas.height === window.innerHeight))){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return true;
  }
  return false;
}

function updateCanvasSize(){
  gl.viewport( 0, 0, canvas.width, canvas.height );
  mat4.perspective(45, canvas.width / canvas.height, 
                   0.1, 200.0, perspective);
}

function init() {
  canvas = document.getElementById( "gl-canvas" );
  
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }
  
  updateCanvasSize();
  
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  
  gl.enable(gl.DEPTH_TEST);
  
  //
  //  Load shaders and initialize attribute buffers
  var program = initShaders( gl,
                            "vertex-shader", 
                            "fragment-shader" );
  gl.useProgram( program );
  
  add_cubes();
  
  var cBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );
  
  var vBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
  var vPos = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPos, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPos );
  
  projectionUniformId = gl.getUniformLocation(program, "projection"); 
  
  render();
}

function executeInteraction(){
  if(mouseDown){
    var mouseXOffset = mouseX - centerX;
    var mouseYOffset = mouseY - centerY;
    if(isRightClick)
      cameraVelocity = -mouseYOffset * cameraVelocitySensitivity;
    else{
      rotationVelocityY = mouseXOffset * cameraRotationSensitivity;
      rotationVelocityX = mouseYOffset * cameraRotationSensitivity;
    }
  }
}

function moveCamera(){
  // Increment the rotation
  cameraRotation[X] += rotationVelocityX;
  cameraRotation[Y] += rotationVelocityY;
  rotationVelocityX *= dampeningFactor;
  rotationVelocityY *= dampeningFactor;
  
  // Move the camera forwards or backwards
  mat4.identity(projection);
  mat4.rotateY(projection, - cameraRotation[Y]);
  mat4.rotateX(projection, - cameraRotation[X]);
  
  vec3.set(unitVectorZ, cameraVelocityVector);
  vec3.scale(cameraVelocityVector, cameraVelocity);
  mat4.multiplyVec3(projection, cameraVelocityVector)
  vec3.add(cameraTranslation, cameraVelocityVector);
}

function updateProjectionMatrix(){
  mat4.identity(projection);
  mat4.rotateX(projection, cameraRotation[X]);
  mat4.rotateY(projection, cameraRotation[Y]);
  mat4.translate(projection, cameraTranslation);
  mat4.multiply(perspective, projection, projection);
}


var render = function(){
  if(resizeCanvas())
    updateCanvasSize();
  
  executeInteraction();
  moveCamera();
  updateProjectionMatrix();
  
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix4fv(projectionUniformId, false, projection);
  gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length );
  
  requestAnimFrame(render);
};
  
document.addEventListener('mousedown', function(e){
  mouseX = e.clientX;
  mouseY = e.clientY;
  centerX = mouseX;
  centerY = mouseY;
  mouseDown = true;
});

document.addEventListener('mouseup', function(e){
  mouseDown = false;
  isRightClick = false;
});

// This one listens for right-click events
document.addEventListener('contextmenu', function(e){
  isRightClick = true;
  e.preventDefault();
  return false;
});

document.addEventListener('mousemove', function(e){
  mouseX = e.clientX;
  mouseY = e.clientY;
});

