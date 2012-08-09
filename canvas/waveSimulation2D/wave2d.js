var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var pullStrength = 0.005;
var dampeningFactor = 0.98;
var initialHeight = 0.5;
var cells = [];
var gridSize = 50;
var conservationOfMassCorrection = 0;
var cellWidth = 1 / (gridSize-1) * canvas.width;
var cellHeight = 1 / (gridSize-1) * canvas.height;

var mouseX, mouseY, mouseDown;
var animate = false;

function executeFrame(){
  if(animate)
    requestAnimFrame(executeFrame);
  clearCanvas();
  drawCells();
  iterateSimulation();
  executeMouseInteraction();
};

// Store the color strings as an object re-use optimization.
// (otherwise new string objects would be created for each color each frame)
var grayStrings = [];
for(var gray = 0;gray < 255; gray++){
    // this transforms strings from 'rgb(255,190,201)' to '#FF564B'
    c.fillStyle = 'rgb('+gray+','+gray+','+gray+')';
    // store the colors of the form '#FF564B'
    grayStrings.push(c.fillStyle);
}

for(var i = 0; i < gridSize; i++){
  for(var j = 0; j < gridSize; j++){
  
    // Raise a single cell so the simulation is
    // initialized with something that looks interesting
    var isRaisedCell = false;
    if(i === Math.floor(gridSize*1/4))
      if(j === Math.floor(gridSize*1/4))
        isRaisedCell = true;
    
    cells.push({
      // for a still initial surface
      //height: 0.5,
       
      // for an initial wave:
      height: isRaisedCell ? 4 : initialHeight,
      
      velocity: 0
    });
  }
}

function clearCanvas(){
  // resizes to full screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  cellWidth = 1 / (gridSize-1) * canvas.width;
  cellHeight = 1 / (gridSize-1) * canvas.height;
}
function drawCells(){
  
  for(var i = 0; i < gridSize; i++){
    for(var j = 0; j < gridSize; j++){
      var cell = cells[i + j * gridSize];
      var x = i / (gridSize-1) * canvas.width;
      var y = j / (gridSize-1) * canvas.height;
      var gray = Math.floor(cell.height * 255);
      gray = gray > 255 ? 255 : gray < 0 ? 0 : gray;
      
      // This commented method of defining the colors
      // would create lots of new String objects.
      // Better to re-use existing objects so that
      // no memory is allocated/released each frame.
      //c.fillStyle = 'rgb('+gray+','+gray+','+gray+')';
      
      c.fillStyle = grayStrings[gray];
      c.fillRect(x,y,cellWidth+1,cellHeight+1);
    }
  }
}
function iterateSimulation(){
  var avgHeight = 0;
  for(var i = 0; i < gridSize; i++){
    for(var j = 0; j < gridSize; j++){
      // center cell
      var c = cells[i + j * gridSize];
      
      for(var di = -1; di <= 1; di++){
        for(var dj = -1; dj <= 1; dj++){
        
          if(di !== 0 || dj !== 0){
            var ni = ((i + di) + gridSize) % gridSize;
            var nj = ((j + dj) + gridSize) % gridSize;
            
            var neighbor = cells[ni + nj * gridSize];
            
            // pull toward neighbors
            c.velocity += pullStrength * (neighbor.height - c.height);
          }
        }
      }
      
      // increment velocity
      c.height += c.velocity;
      
      // ensure conservation of mass
      c.height += conservationOfMassCorrection;
      
      // apply dampening
      c.velocity *= dampeningFactor;
      
      avgHeight += c.height;
    }
  }
  avgHeight /= Math.pow(gridSize - 1,2);
  
  conservationOfMassCorrection = initialHeight - avgHeight;
}

function executeMouseInteraction(){
  if(mouseDown){
    var i = Math.floor((gridSize-1) * mouseX / canvas.width);
    var j = Math.floor((gridSize-1) * mouseY / canvas.height);
    var cell = cells[i + j * gridSize];
    cell.height = 2;
    cell.velocity = 0;
  }
}

canvas.addEventListener("mousedown",function(e){
  mouseDown = true;
  mouseX = e.offsetX;
  mouseY = e.offsetY;
});

canvas.addEventListener("mousemove",function(e){
  mouseX = e.offsetX;
  mouseY = e.offsetY;
});

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

// Iterate the simulation a couple of times
// so the program shows something before animation starts.
for(var i = 0; i < 7; i++)
  iterateSimulation();

// Draw the first frame
executeFrame();