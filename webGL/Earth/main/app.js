
// Textured Sphere Example
// Curran Kelleher 11/27/2012
// Derived from Ed Angel's example:
// http://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SIXTH_EDITION/CODE/WebGL/CHAPTER05/chap5ex3.html

var canvas;
var gl;

var gridSize = 100;
var gridWidth = gridSize;
var gridHeight = gridSize;

var time = 0,
    timeIncrement = 0.01;

// `uniforms` contains the identifiers of OpenGL uniforms.
//
//  * `uniforms.modelView`
//  * `uniforms.projection`
//  * `uniforms.time`
//  * `uniforms.renderPass`
var uniforms = {};

// The arrays 'vertices'
// contains a grid of vertices and their corresponding normals.
// These are flattened 2D arrays indexed as follows:
//   index = i * (gridWidth + 1) * j;
// 
// 'vertices' contains extra vertices that are not drawn.
// These are included so the normals along the edges can be computed.
// For 'vertices':
//   0 <= i <= gridWidth
//   0 <= j <= gridHeight
var vertices = [];

// The spherical coordinates corresponding to
// vertices. Used for texture mapping.
var sphericalCoords = [];

// This function computes the index from i and j grid coordinates.
var indexFromIJ = function(i, j){
  return i + j * (gridWidth + 1);
};

// These point and normal arrays are passed into the GPU.
// The layout is determined by a zig-zag pattern over the
// grid required for using TRIANGLE_STRIP.
// The content is derived from the original 'vertices'
// and 'normals' arrays.
var pointsArray = [];
var sphericalCoordsArray = [];

window.onload = init;

var program;

var Xaxis = 0;
var Yaxis = 1;
var Zaxis = 2;
var Axis = Yaxis;
var theta = [-1, 0, 0];
var thetaVelocity = [0, 0, 0];
var dampening = 0.98;


var ThetaId;

var texture, textureInitialized = false;
function initTexture() {
  texture = gl.createTexture();
  texture.image = new Image();
  texture.image.crossOrigin = '';
  texture.image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 
                  gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    textureInitialized = true;
  }
  //image from http://www.naturalearthdata.com/
}

function setTextureImage(imageName){
  console.log("initializing "+imageName);
  //texture.image.src = "http://universaldatacube.org/0.2/examples/naturalEarthWebGLSphere/images/"+imageName+".jpg";
  texture.image.src = "../images/"+imageName+".jpg";
}

function initVertices(){
  var i, j, 
      x, y, z, vertex, index;
  for(j = 0; j <= gridHeight; j++){
    for(i = 0; i <= gridWidth; i++){
      index = indexFromIJ(i, j);
      sphericalCoords[index] = [
        j / (gridWidth - 1), 
        i / (gridHeight - 1)
      ];
    }
  }
}

function initPointsAndNormalsArrays(){
  var i = -1, a, b, c, d,
      iLimit, iIncrement;
  for(j = 0; j < gridHeight - 1; j++){
    // Zig
    if(i === -1){
      iLimit = gridWidth - 1;
      iIncrement = 1;
    }
    // Zag
    else if(i === (gridWidth - 1)){
      iLimit = -1;
      iIncrement = -1;
    }
    i+= iIncrement;
    for(; i != iLimit; i+= iIncrement){
      
      // For each (i,j) position, add two triangles
      //
      // Layout:  a - b
      //          | / |
      //          c - d
      //
      // Triangles:
      //
      //  * (v[a], v[b], v[c])
      //  * (v[b], v[c], v[d])
      
      a = indexFromIJ(  i  ,   j  );
      b = indexFromIJ(i + 1,   j  );
      c = indexFromIJ(  i  , j + 1);
      d = indexFromIJ(i + 1, j + 1);
      
      pointsArray.push(point4.create(vertices[a]));
      sphericalCoordsArray.push(sphericalCoords[a]);
      
      pointsArray.push(point4.create(vertices[b]));
      sphericalCoordsArray.push(sphericalCoords[b]);
      
      pointsArray.push(point4.create(vertices[c]));
      sphericalCoordsArray.push(sphericalCoords[c]);
      
      pointsArray.push(point4.create(vertices[d]));
      sphericalCoordsArray.push(sphericalCoords[d]);
    }
  }
}


function resizeIfNeeded(){
  if(!((canvas.width === window.innerWidth) && 
       (canvas.height === window.innerHeight))){
    var size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = canvas.height = size;
    gl.viewport( 0, 0, canvas.width, canvas.height );
  }
}
var render = function(){
  
  resizeIfNeeded();
  
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Constant slow rotation
  theta[Zaxis] += 0.002;
  
  // Compute the modelView uniform
  var model_view = mat4.create();
  mat4.identity(model_view);
  
  mat4.rotateX(model_view, theta[Xaxis] );
  mat4.rotateY(model_view, theta[Yaxis] );
  mat4.rotateZ(model_view, theta[Zaxis] );

  // Pass the modelView uniform to the GPU
  gl.uniformMatrix4fv( uniforms.modelView, false, model_view );

  // Compute time
  time += timeIncrement;

  // Pass the time uniform to the GPU
  gl.uniform1f( uniforms.time, time );
  
  var BACK = -1;
  var FRONT = 1;

  if(textureInitialized){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    var uSamplerID = gl.getUniformLocation(program, "uSampler");
    gl.uniform1i(uSamplerID, 0);
    
    gl.uniform1f( uniforms.renderPass, BACK );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, pointsArray.length );
    gl.uniform1f( uniforms.renderPass, FRONT );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, pointsArray.length );
  }
    
  for(var i = 0; i < 3; i++){
    thetaVelocity[i] *= dampening;
    theta[i] += thetaVelocity[i];
  }
  
  requestAnimFrame(render);
}

function setUpInteraction(){
  var mouseIsDown = false;
  var mouseSensitivity = 0.001;
  var previousX, previousY;

  canvas.addEventListener('mousedown', function(e){
    mouseIsDown = true;
    previousX = e.pageX;
    previousY = e.pageY;
  });
  
  canvas.addEventListener('mouseup', function(e){
    mouseIsDown = false;
  });
  
  canvas.addEventListener('mouseout', function(e){
    mouseIsDown = false;
  });
  
  canvas.addEventListener('mousemove', function(e){
    if(mouseIsDown){
      var dx = e.pageX - previousX;
      var dy = e.pageY - previousY;
      
      thetaVelocity[Zaxis] += dx * mouseSensitivity;
      thetaVelocity[Xaxis] += dy * mouseSensitivity;
      
      previousX = e.pageX;
      previousY = e.pageY;
    }
  });
}
function initArrowKeyListener(imageNames){
  var keys = {left: 37, right: 39},
      actions = {},
      i = 0,
      n = imageNames.length;

  actions[keys.left] = function(){
    i = (i - 1 + n) % n;
    setTextureImage(imageNames[i]);
  };
  
  actions[keys.right] = function(){
    i = (i + 1) % n;
    setTextureImage(imageNames[i]);
  };

  document.addEventListener('keydown', function(event){
    var action = actions[event.which];
    if(action)
      action();
  });
}

function init() {
  canvas = document.getElementById( "gl-canvas" );
  setUpInteraction();
  
  gl = WebGLUtils.setupWebGL( canvas );
  if (!gl ) { alert( "WebGL isn't available" ); }
  
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  
  //gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA  );
  gl.enable(gl.POLYGON_OFFSET_FILL);
  
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  
  // Compute the vertices of the surface.
  initVertices();
  
  // Arrange the vertices and normals into a
  // zig-zag pattern suitable for direct input to
  // OpenGL's TRIANGLE_STRIP mode
  // with POLYGON_OFFSET_FILL enabled.
  initPointsAndNormalsArrays();
 
  var vBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
  
  var sphereBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, sphereBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, 
                 flatten(sphericalCoordsArray), gl.STATIC_DRAW );
  
  var sphereCoordsId = gl.getAttribLocation( program, "sphereCoords" );
  gl.vertexAttribPointer( sphereCoordsId, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( sphereCoordsId );
  
  uniforms.time = gl.getUniformLocation(program, "time"); 
  uniforms.renderPass = gl.getUniformLocation(program, "renderPass"); 
  uniforms.modelView = gl.getUniformLocation(program, "ModelView");
  
  viewer_pos = point3.create([ 0.0, 0.0, -10.0] );
  
  projection = mat4.ortho(-1, 1, -1, 1, -1, 1);
  
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "Projection"), 
    false, projection);
  
  initTexture();
  setTextureImage("NE2_50M_SR_W");
  initArrowKeyListener([
    "NE2_50M_SR_W",
    "nasaBlackMarble",
    "GRAY_50M_SR_OB",
    "HYP_50M_SR",
    "OB_50M",
    "SR_50M",
    "NE1_50M_SR_W",
  ]);
  render();
}
