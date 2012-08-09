var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var pullStrength = 0.01;
var dampeningFactor = 0.99;
var initialHeight = 0.5;
var cells = [];
var gridSize = 100;
var conservationOfMassCorrection = 0;
var cellWidth = 1 / (gridSize-1) * canvas.width;
var mouseX, mouseY, mouseDown;
var animate = false;

// This function executes once per animation frame
function executeFrame(){
  if(animate)
    requestAnimFrame(executeFrame);
  clearCanvas();
  drawCells();
  iterateSimulation();
  executeMouseInteraction();
}

// Initialize the water height
for(var i = 0; i < gridSize; i++){
  cells.push({
    // for a still initial surface
    //height: 0.5,
     
    // for an initial wave:
    height: i === Math.floor(gridSize*1/4) ? 1 : initialHeight,
    
    velocity: 0
  });
}

function clearCanvas(){
  // resizes to full screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cellWidth = 1 / (gridSize-1) * canvas.width;
}

function drawCells(){
  c.beginPath();
  c.moveTo(canvas.width, canvas.height);
  c.lineTo(0, canvas.height);
  for(var i = 0; i < gridSize; i++){
    var cell = cells[i];
    var x = i / (gridSize-1) * canvas.width;
    var y = canvas.height - cell.height * canvas.height;
    c.lineTo(x,y);
  }
  c.closePath();
  c.fill();
}

// Increment the wave simulation:
// Neighboring cells pull on one another.
function iterateSimulation(){
  var avgHeight = 0;
  for(var i = 0; i < gridSize; i++){
    // center cell
    var c = cells[i];
    
    // left neighbor
    var l = cells[((i - 1) + gridSize) % gridSize];
    
    // right neighbor
    var r = cells[(i + 1) % gridSize];
    
    // pull toward neighbors
    c.velocity += pullStrength * (l.height - c.height);
    c.velocity += pullStrength * (r.height - c.height);
    
    // increment velocity
    c.height += c.velocity;
    
    // ensure conservation of mass
    c.height += conservationOfMassCorrection;
    
    // apply dampening
    c.velocity *= dampeningFactor;
    
    avgHeight += c.height;
  }
  avgHeight /= (gridSize - 1);
  
  conservationOfMassCorrection = initialHeight - avgHeight;
}

// Pull the wave cell closest to the mouse
function executeMouseInteraction(){
  if(mouseDown){
    for(var i = 0; i < gridSize; i++){
      var x = i / (gridSize-1) * canvas.width;
      if(Math.abs(x - mouseX) < cellWidth){
        var cell = cells[i];
        cell.height = 1 - mouseY/canvas.height;
        cell.velocity = 0;
      }
    }
  }
}

// Record when the mouse is pressed
canvas.addEventListener("mousedown",function(e){
  mouseDown = true;
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Record when the mouse is moved
canvas.addEventListener("mousemove",function(e){
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Record when the mouse is released
canvas.addEventListener("mouseup",function(e){
  mouseDown = false;
});

// Kick off the animation when the mouse enters the canvas
canvas.addEventListener('mouseover', function(e){
  animate = true;
  executeFrame();
});

// Pause animation when the mouse exits the canvas
canvas.addEventListener("mouseout",function(e){
  mouseDown = false;
  animate = false;
});

// Draw the first frame
executeFrame();