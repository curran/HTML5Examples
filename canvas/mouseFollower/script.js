var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var radius = 30;

function drawCircle(mouseX, mouseY){
  // Clear the background
  c.clearRect(0, 0, canvas.width, canvas.height);
  
  // Establish the circle path
  c.beginPath();
  c.arc(mouseX, mouseY, radius, 0 , 2 * Math.PI, false);
  
  // Fill the circle
  c.fillStyle = '00F0FF';
  c.fill();
  
  // Outline (stroke) the circle
  c.lineWidth = 4;
  c.strokeStyle = 'black';
  c.stroke();
}

// Redraw the circle every time the mouse moves
canvas.addEventListener('mousemove',function(e){
  drawCircle(e.clientX, e.clientY);
});

// Clear the canvas when the mouse leaves the canvas region
canvas.addEventListener('mouseout',function(e){
  c.clearRect(0, 0, canvas.width, canvas.height);
});

// Draw a circle in the center initially,
// so the program hints at what it does before any mouse interaction
drawCircle(canvas.width / 2, canvas.height / 2);