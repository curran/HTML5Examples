// Mesh Example
// Curran Kelleher 11/6/2012
// Derived from Ed Angel's example:
// http://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SIXTH_EDITION/CODE/WebGL/CHAPTER05/chap5ex3.html

var canvas;
var gl;

var gridSize = 100;
var gridWidth = gridSize;
var gridHeight = gridSize;

// The two arrays 'vertices' and 'normals'
// contain a grid of vertices and their corresponding normals.
// These are flattened 2D arrays indexed as follows:
//   index = i * (gridWidth + 1) * j;
// 
// 'vertices' contains extra vertices that are not drawn.
// These are included so the normals along the edges can be computed.
// For 'vertices':
//   0 <= i <= gridWidth
//   0 <= j <= gridHeight
var vertices = [];

// For 'normals':
//   0 <= i < gridWidth
//   0 <= j < gridHeight
var normals = [];

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
var normalsArray = [];


window.onload = init;

var ctm;
var ambient_color, diffuse_color, specular_color;
var model_view, projection;
var viewer_pos;
var program;

var Xaxis = 0;
var Yaxis = 1;
var Zaxis = 2;
var Axis = Yaxis;
var theta = [-1.5, 0, 0];

var ThetaId;

function initVertices(){
  var i, j, x, y, z, vertex, index;
  
  var freq = 20;
  for(j = 0; j <= gridHeight; j++){
    for(i = 0; i <= gridWidth; i++){
      x = i / (gridWidth - 1);
      z = j / (gridHeight - 1);
      y = Math.sin(x * z * freq) / 10;
      y += Math.sin((x - 1) * z * freq) / 10;
      vertex = [x, y, z, 1];
      index = indexFromIJ(i, j);
      vertices[index] = vertex;
    }
  }
}

function initNormals(){
  var i, j, a, b, c, normal, t1, t2;
  for(j = 0; j < gridHeight; j++){
    for(i = 0; i < gridWidth; i++){
      a = indexFromIJ(  i  ,   j  );
      b = indexFromIJ(i + 1,   j  );
      c = indexFromIJ(  i  , j + 1);
      
      normal = vec4.create();
      t1 = vec4.create();
      t2 = vec4.create();
      vec4.subtract(vertices[b], vertices[a], t1);
      vec4.subtract(vertices[c], vertices[b], t2);
      vec3.cross(t1, t2, normal);
      vec4.normalize(normal);
      normals[a] = vec4.create(normal);
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
      normalsArray.push(point4.create(normals[a]));
      pointsArray.push(point4.create(vertices[b]));
      normalsArray.push(point4.create(normals[b]));
      pointsArray.push(point4.create(vertices[c]));
      normalsArray.push(point4.create(normals[c]));
      pointsArray.push(point4.create(vertices[d]));
      normalsArray.push(point4.create(normals[d]));
      
    }
  }
}

// Translate the model, just so it is
// centered on the screen.
var modelTranslation = [-.5, 0, -.5];

var render = function(){
  
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Constant slow rotation
  theta[Yaxis] += 0.002;
  
  
  model_view = mat4.create();
  mat4.identity(model_view);
  
  
  mat4.rotateX(model_view, theta[Xaxis] );
  mat4.rotateY(model_view, theta[Yaxis] );
  mat4.rotateZ(model_view, theta[Zaxis] );
  
  mat4.translate(model_view, modelTranslation);
  
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "ModelView"), 
    false, 
    model_view );
  
  gl.drawArrays( gl.TRIANGLE_STRIP, 0, pointsArray.length );
  
  requestAnimFrame(render);
}
    
function setUpInteraction(){
  var mouseIsDown = false;
  var mouseSensitivity = 0.02;
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
      
      theta[Yaxis] += dx * mouseSensitivity;
      theta[Xaxis] += dy * mouseSensitivity;
      
      previousX = e.pageX;
      previousY = e.pageY;
    }
  });
}

function init() {
  canvas = document.getElementById( "gl-canvas" );
  setUpInteraction();
  
  gl = WebGLUtils.setupWebGL( canvas );
  if (!gl ) { alert( "WebGL isn't available" ); }
  
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
  
  
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  
  // Compute the vertices of the surface.
  initVertices();
  
  // Compute the normals for each vertex.
  initNormals();
  
  // Arrange the vertices and normals into a
  // zig-zag pattern suitable for direct input to
  // OpenGL's TRIANGLE_STRIP mode
  // with POLYGON_OFFSET_FILL enabled.
  initPointsAndNormalsArrays();
   
  
  var nBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, nBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
  var vNormalId = gl.getAttribLocation( program, "vNormal" );
  gl.vertexAttribPointer( vNormalId, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormalId );
  
  var vBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
  var vPosId = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosId, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosId );
  
  thetaId = gl.getUniformLocation(program, "theta"); 
  
  viewer_pos = point3.create([ 0.0, 0.0, -10.0] );
  
  projection = mat4.ortho(-1, 1, -1, 1, -100, 100);
  
  var light_position = point4.create([1.0, 1.0, 1.0, 0.0] );
  var light_ambient = point4.create([0.2, 0.2, 0.2, 1.0 ]);
  var light_diffuse = point4.create([ 1.0, 1.0, 1.0, 1.0 ]);
  var light_specular = point4.create([ 1.0, 1.0, 1.0, 1.0 ]);
  
  var material_ambient = point4.create([ 1.0, 0.0, 1.0, 1.0] );
  var material_diffuse = point4.create([ 1.0, 0.8, 0.0, 1.0] );
  var material_specular = point4.create([ 1.0, 0.8, 0.0, 1.0] );
  var material_shininess = 100.0;
  
  var ambient_product = point4.create();
  var diffuse_product = point4.create();
  var specular_product = point4.create();
  
  point4.mult(light_ambient, material_ambient,  ambient_product);
  point4.mult(light_diffuse, material_diffuse, diffuse_product);
  point4.mult(light_specular, material_specular, specular_product);
  
  gl.uniform4fv( gl.getUniformLocation(
    program, "AmbientProduct"),ambient_product );
  gl.uniform4fv( gl.getUniformLocation(
    program, "DiffuseProduct"),diffuse_product );
  gl.uniform4fv( gl.getUniformLocation(
    program, "SpecularProduct"),specular_product );	
  gl.uniform4fv( gl.getUniformLocation(
    program, "LightPosition"),light_position );
  gl.uniform1f( gl.getUniformLocation(
    program, "Shininess"),material_shininess );
  
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "Projection"), 
    false, projection);
  
  render();
}
