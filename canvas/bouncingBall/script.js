// shim layer for requestAnimationFrame with setTimeout fallback
// from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
var requestAnimFrame = (function(){
  return window.requestAnimationFrame       || 
         window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame    || 
         window.oRequestAnimationFrame      || 
         window.msRequestAnimationFrame     || 
         function( callback ){
           window.setTimeout(callback, 1000 / 60);
         };
})();

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var radius = 32;
var lineWidth = 4;
var gravity = 0.1;
var dampening = 0.995;
var mousePullStrength = 0.005;
var animate = false;

var mouse = {
  x : 0, 
  y : 0,
  down: false
};

var circle = {
  x : canvas.width/2,
  y : canvas.height/2,
  vx: 0, // 'v' stands for 'velocity'
  vy: 0
};

function executeFrame(){
  if(animate)
    requestAnimFrame(executeFrame);
  incrementSimulation();
  c.clearRect(0, 0, canvas.width, canvas.height);
  drawBox();
  drawCircle();
  if(mouse.down)
    drawLineToMouse();
}

function incrementSimulation(){
  // Pull the circle toward the mouse
  if(mouse.down){
    var dx = mouse.x - circle.x,
        dy = mouse.y - circle.y,
        distance = Math.sqrt(dx*dx + dy*dy),
        unitX = dx / distance,
        unitY = dy / distance,
        force = distance * mousePullStrength;
    circle.vx += unitX * force;
    circle.vy += unitY * force;
  }
  
  // Execute gravity
  circle.vy += gravity;
  
  // Execute dampening (slowing down)
  circle.vx *= dampening;
  circle.vy *= dampening;
  
  // Increment the position by the velocity
  circle.x += circle.vx;
  circle.y += circle.vy;
  
  // Bounce off the floor
  if(circle.y + radius > canvas.height){
    circle.y = canvas.height - radius;
    circle.vy = - Math.abs(circle.vy);
  }
  // Bounce off the ceiling
  else if(circle.y - radius < 0){
    circle.y = radius;
    circle.vy = Math.abs(circle.vy);
  }
  // Bounce off the right wall
  if(circle.x + radius > canvas.width){
    circle.x = canvas.width - radius;
    circle.vx = - Math.abs(circle.vx);
  }
  // Bounce off the left wall
  else if(circle.x - radius < 0){
    circle.x = radius;
    circle.vx = Math.abs(circle.vx);
  }
}

function drawBox(){
  c.lineWidth = 1;
  c.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
}

function drawCircle(){
  c.beginPath();
  c.arc(circle.x, circle.y, radius - lineWidth/2, 0 , 2 * Math.PI, false);
  c.fillStyle = '00F0FF';
  c.fill();
  c.lineWidth = 4;
  c.strokeStyle = 'black';
  c.stroke();
}

function drawLineToMouse(){
  c.lineWidth = 2;
  c.moveTo(circle.x, circle.y);
  c.lineTo(mouse.x, mouse.y);
  c.stroke();
}

canvas.addEventListener('mousedown',function(e){
  mouse.down = true;
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});

canvas.addEventListener('mousemove', function(e){
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});

canvas.addEventListener('mouseup', function(e){
  mouse.down = false;
});

// Start animating when the mouse enters the canvas
canvas.addEventListener('mouseover', function(e){
  animate = true;
  executeFrame();
});

// Stop animating when the mouse exits the canvas
canvas.addEventListener('mouseout', function(e){
  mouse.down = false;
  animate = false;
});

// Draw the initial scene once, so something
// is displayed before animation starts.
executeFrame();