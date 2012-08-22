
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var gravity = 0.1;
var radius = 20;
var numCircles = 10;
var dampeningFactor = 0.99;
var circles = [];
var i, j, circle, circle2;
var mouse = {
  x: 0,
  y: 0,
  down: false
};
var circleUnderMouse;
var ballMouseY, ballMouseX, pullForceY, pullForceX;
var r, g, b;
var animate = false;

initializeCircles();

function executeFrame(){
  if(animate)
    requestAnimFrame(executeFrame);
  iterateSimulation();
  
  c.fillStyle = 'rgba(255,255,255,0.3)';
  c.fillRect(0,0,canvas.width,canvas.height);
  
  drawCircles();
}

function initializeCircles(){
  circles = [];
  for(i = 0; i < numCircles; i++){
    circle = {
      x: Math.random() * canvas.width, 
      y: Math.random() * canvas.height,
      velocity:{x:0, y:0}
    };
    circles.push(circle);
  }
}

function drawCircles(){
  
  // Resize to the screen
  if(canvas.width != window.innerWidth || canvas.width != window.innerWidth){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeCircles();
    iterateSimulation();
  }
  
  // draw rectangle border
  c.lineWidth = "3";
  c.strokeRect(0,0,canvas.width,canvas.height);
  // draw circles
  for(i = 0; i < numCircles; i++){
    circle = circles[i];
    r = i*5;
    g = i*10;
    b = i*15;
    // draw connecting line from ball to mouse
    if(circle == circleUnderMouse){        
      c.beginPath();
      c.moveTo(circle.x, circle.y);
      c.lineTo(mouse.x, mouse.y);
      c.lineWidth = "2";
      c.strokeStyle="black";
      c.stroke();
    }
    c.beginPath();
    c.arc(circle.x, circle.y, radius, 0, 2 * Math.PI);
    if(circle == circleUnderMouse){
      c.fillStyle = "C1FF24";
      c.lineWidth = "5";
      c.stroke();
    }
    else{
      c.fillStyle = 'rgb('+r+', '+g+', '+b+')';
    }
    c.fill();
  }
}

function iterateSimulation(){
  for(i = 0; i < numCircles; i++){
    circle = circles[i];
    
    // pull ball to mouse
    pullBallToMouse();
    
    // Add gravity
    circle.velocity.y += gravity;
    
    // slows things down
    circle.velocity.x *= dampeningFactor;
    circle.velocity.y *= dampeningFactor;
    
    // Add velocity to position
    circle.x += circle.velocity.x;
    circle.y += circle.velocity.y;
    
    // Make them bounce off the floor
    if(circle.y > canvas.height - radius){
      circle.y = canvas.height - radius;
      circle.velocity.y = - Math.abs(circle.velocity.y);
    } // bounce off ceiling
    if(circle.y < radius){
      circle.y = radius;
      circle.velocity.y = Math.abs(circle.velocity.y);
    } // bounce off right wall
    if(circle.x > canvas.width - radius){
      circle.x = canvas.width - radius;
      circle.velocity.x = -Math.abs(circle.velocity.x);
    } // bounce off left wall
    if(circle.x < radius){
      circle.x = radius;
      circle.velocity.x = Math.abs(circle.velocity.x);
    }
    
    // REPULSION between circles
    for(j = i + 1; j < numCircles; j++){
      circle2 = circles[j];
      var dx = circle2.x - circle.x;
      var dy = circle2.y - circle.y;
      var d = Math.sqrt(dx*dx + dy*dy);
      
      if(d < 2*radius){
        if(d === 0){
          d = 0.1;
        }
        var unitX = dx/d;
        var unitY = dy/d;
        
        var force = -2;
        
        var forceX = unitX * force;
        var forceY = unitY * force;
        
        circle.velocity.x += forceX;
        circle.velocity.y += forceY;
        
        circle2.velocity.x -= forceX;
        circle2.velocity.y -= forceY;
      }
    }
  }
}

function pullBallToMouse(){
  if(circle == circleUnderMouse){
    ballMouseY = mouse.y - circle.y;
    ballMouseX = mouse.x - circle.x;
    
    pullForceY = ballMouseY * 0.02;
    pullForceX = ballMouseX * 0.02;
    
    circle.velocity.y += pullForceY;
    circle.velocity.x += pullForceX;
  }  
}

canvas.addEventListener("mousemove", function(e){
  mouse.x = e.x;
  mouse.y = e.y;
});

canvas.addEventListener("mousedown", function(e){
  mouse.down = true;
  mouse.x = e.x;
  mouse.y = e.y;
  
  for(i = 0; i < circles.length; i++){
    var circle = circles[i]; // get circle out of array
    var dx = mouse.x - circle.x;
    var dy = mouse.y - circle.y;
    var d = Math.sqrt(dx*dx + dy*dy);
    
    if(d < radius){
      circleUnderMouse = circle;
      break; // break (stop) the for loop
    }
  }
});

canvas.addEventListener("mouseup", function(e){
  mouse.down = false;
  circleUnderMouse = null;
});

canvas.addEventListener("mouseout", function(e){
  mouse.down = false;
  circleUnderMouse = null;
});


// Kick off the animation when the mouse enters the canvas
canvas.addEventListener('mouseover', function(e){
  animate = true;
  executeFrame();
});

// Pause animation when the mouse exits the canvas
canvas.addEventListener("mouseout",function(e){
  animate = false;
});

// Draw the first frame to start animation
executeFrame();