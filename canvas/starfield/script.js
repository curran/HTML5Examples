
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var numStars = 1000;
var radius = 1;
var focalLength = canvas.width;

var centerX, centerY;

var stars = [], star;
var i;

var animate = false;

initializeStars();

function executeFrame(){
  if(animate)
    requestAnimFrame(executeFrame);
  moveStars();
  drawStars();
}

function initializeStars(){
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  
  stars = [];
  for(i = 0; i < numStars; i++){
    star = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width
    };
    stars.push(star);
  }
}

function moveStars(){
  for(i = 0; i < numStars; i++){
    star = stars[i];
    star.z--;
    
    if(star.z <= 0){
      star.z = canvas.width;
    }
  }
}

function drawStars(){
  var pixelX, pixelY, pixelRadius;
  
  // Resize to the screen
  if(canvas.width != window.innerWidth || canvas.width != window.innerWidth){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeStars();
  }
  
  c.fillStyle = "black";
  c.fillRect(0,0, canvas.width, canvas.height);
  c.fillStyle = "white";
  for(i = 0; i < numStars; i++){
    star = stars[i];
    
    pixelX = (star.x - centerX) * (focalLength / star.z);
    pixelX += centerX;
    pixelY = (star.y - centerY) * (focalLength / star.z);
    pixelY += centerY;
    pixelRadius = radius * (focalLength / star.z);
    
    c.beginPath();
    c.arc(pixelX, pixelY, pixelRadius, 0, 2 * Math.PI);
    c.fill();
  }
}

canvas.addEventListener("mousemove",function(e){
  focalLength = e.x;
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

// Draw the first frame to start animation
executeFrame();