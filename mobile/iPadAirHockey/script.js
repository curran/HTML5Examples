var PUCK = 'puck';
var MALLET = 'mallet';

// Player 1 on the left, player 2 on the right
var PLAYER1 = 1;
var PLAYER2 = 2;

var numPucks, player1Score, player2Score;

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var mouseId = 'mouse';

// Keys are touch identifiers (or mouseID)
// Values are circle objects
var circlesBeingMoved = {};

var puckRadius = 20;
var malletRadius = 40;
var sidelineMargin = puckRadius * 2 + 5.5;

var goalWidth = 150;
var goalDepth = 10;

var dampeningFactor = 0.99;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var centerX = canvas.width / 2;
var centerY = canvas.height / 2;

var circles = [];

function resetGame(){
  circles = [
    {
      type: PUCK,
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: puckRadius,
      velocity: {x:0, y:0}
    },
    {
      type: MALLET,
      player: PLAYER1,
      x: canvas.width * 1 / 4,
      y: canvas.height / 2,
      radius: malletRadius,
      velocity: {x:0, y:0}
    },
    {
      type: MALLET,
      player: PLAYER2,
      x: canvas.width * 3 / 4,
      y: canvas.height / 2,
      radius: malletRadius,
      velocity: {x:0, y:0}
    }
  ];
  numPucks = 7;
  player1Score = 0;
  player2Score = 0;
}

function executeFrame(){
  requestAnimFrame(executeFrame);
  iterateSimulation();
  c.clearRect(0, 0, canvas.width, canvas.height);
  drawCourt();
  drawCircles();
}

function drawCircleObject(circle){
  drawCircle(circle.x, circle.y, circle.radius);
}

function drawCircle(x, y, radius){
  c.beginPath();
  c.arc(x, y, radius, 0, 2 * Math.PI);
  c.fill();
}

function drawLine(x1, y1, x2, y2){
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function drawCourt(){
  var y1 = sidelineMargin;
  var y2 = canvas.height - sidelineMargin;
  
  //points recorder line
  drawLine(0, y1, canvas.width, y1);
  
  //remaining pucks line
  drawLine(0, y2, canvas.width, y2);
  
  //middle line
  drawLine(centerX, y1, centerX, y2);
  
  //draw player 1 goal on the left side
  c.strokeRect(0, centerY - goalWidth / 2, goalDepth, goalWidth);
  
  //draw player 2 goal on the right side
  c.strokeRect(canvas.width - goalDepth, centerY - goalWidth / 2, 
               goalDepth, goalWidth);
}

function drawCircles(){
  // Draw the mallets and the puck in play
  c.fillStyle = "black";
  var i, circle;
  for(i = 0; i < circles.length; i++)
    drawCircleObject(circles[i]);
  
  var n, xOffset, span;
  var puckSpacing = 2;
  
  // Draw the remaining pucks at the bottom
  n = numPucks - 1 - player1Score - player2Score;
  span = (n - 1) * (puckRadius * 2 + 2);
  xOffset = canvas.width / 2 - span / 2;
  drawRowOfCircles(n, xOffset, span, canvas.height - sidelineMargin / 2);
  
  // Draw the pucks scored by player 1
  n = player1Score;
  span = (n - 1) * (puckRadius * 2 + puckSpacing);
  xOffset = puckRadius + puckSpacing;
  drawRowOfCircles(n, xOffset, span, sidelineMargin / 2);
  
  // Draw the pucks scored by player 2
  n = player2Score;
  span = (n - 1) * (puckRadius * 2 + puckSpacing);
  xOffset = canvas.width - span - puckRadius - puckSpacing;
  drawRowOfCircles(n, xOffset, span, sidelineMargin / 2);
}

function drawRowOfCircles(n, xOffset, span, y){
  for(var i = 0; i < n; i++){
    if(n == 1)
      x = xOffset;
    else
      x = xOffset + span * (i / (n - 1));
    drawCircle(x, y, puckRadius);
  }
}

function isBehindGoal(circle){
  var behindLeftGoal = circle.x < - circle.radius;
  var behindRightGoal = circle.x > canvas.width + circle.radius;
  return behindLeftGoal || behindRightGoal;
}

function score(puck){
  // Count the score
  if(puck.x < centerX)
    player2Score++;
  else
    player1Score++;
  
  // Center the puck
  puck.x = centerX;
  puck.y = centerY;
  puck.velocity.x = 0;
  puck.velocity.y = 0;
  
  // Reset the game if necessary
  var gameHasBeenWon = (numPucks - player1Score - player2Score === 0);
  if(gameHasBeenWon){
    var winner = player1Score > player2Score ? 1 : 2;
    alert("Congratulations player " + winner+"!");
    resetGame();
  }
}

function iterateSimulation(){
  var circle;
  var y1 = sidelineMargin;
  var y2 = canvas.height - sidelineMargin;
  
  for(i = 0; i < circles.length; i++){
    circle = circles[i];
    
    // if the circle is inside a goal,
    // then put it in the center
    if(isBehindGoal(circle))
      score(circle);
    
    // slows things down
    circle.velocity.x *= dampeningFactor;
    circle.velocity.y *= dampeningFactor;
    
    // Add velocity to position
    if(circle.type == PUCK){
      circle.x += circle.velocity.x;
      circle.y += circle.velocity.y;
    }
    
    
    // Make them bounce off the floor
    if(circle.y > y2 - circle.radius){
      circle.y = y2 - circle.radius;
      circle.velocity.y = - Math.abs(circle.velocity.y);
    }
    // bounce off ceiling
    if(circle.y < circle.radius + y1){
      circle.y = circle.radius + y1;
      circle.velocity.y = Math.abs(circle.velocity.y);
    }
    // bounce off right wall
    if(circle.x > canvas.width - circle.radius && isNotInGoal(circle)){
      circle.x = canvas.width - circle.radius;
      circle.velocity.x = -Math.abs(circle.velocity.x);
    }
    // bounce off left wall
    if(circle.x < circle.radius && isNotInGoal(circle)){
      circle.x = circle.radius;
      circle.velocity.x = Math.abs(circle.velocity.x);
    }
    
    // REPULSION between circles
    for(j = i + 1; j < circles.length; j++){
      circle2 = circles[j];
      var dx = circle2.x - circle.x;
      var dy = circle2.y - circle.y;
      var d = Math.sqrt(dx*dx + dy*dy);
      
      if(d < circle.radius + circle2.radius){
        if(d === 0)
          d = 0.1;
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

function isNotInGoal(circle){
  var underGoalTop = circle.y - circle.radius > centerY - goalWidth / 2;
  var overGoalBottom = circle.y + circle.radius < centerY + goalWidth / 2;
  var isInGoal = underGoalTop && overGoalBottom;
  return !isInGoal;
}

function getCircleUnderPoint(x, y){
  var i, circle, dx, dy, distance;
  for(i = 0; i < circles.length;i++){
    circle = circles[i];
    dx = circle.x - x;
    dy = circle.y - y;
    distance = Math.sqrt(dx * dx + dy * dy);
    
    if(distance < circle.radius)
      return circle;
  }
  return undefined;
}

function pointDown(x, y, id){
  var circleUnderPoint = getCircleUnderPoint(x, y);
  if(circleUnderPoint && circleUnderPoint.type == MALLET)
    circlesBeingMoved[id] = circleUnderPoint;
}

canvas.addEventListener("mousedown", function(e){
  pointDown(e.clientX, e.clientY, mouseId);
});

canvas.addEventListener('touchstart',function(e){
  var i;
  for(i = 0; i < e.changedTouches.length; i++){
    var touch = e.changedTouches[i];
    pointDown(touch.pageX, touch.pageY, touch.identifier);
  }
});

function pointUp(id){
  if(circlesBeingMoved[id])
    delete circlesBeingMoved[id];
}

canvas.addEventListener("mouseup", function(e){
  pointUp(mouseId);
});

canvas.addEventListener("mouseout", function(e){
  pointUp(mouseId);
});

canvas.addEventListener('touchend',function(e){
  var i;
  for(i = 0; i < e.changedTouches.length; i++){
    var touch = e.changedTouches[i];
    pointUp(touch.identifier);
  }
});

function pointMove(x, y, id){
  var circle = circlesBeingMoved[id];
  if(circle){
    circle.x = x;
    circle.y = y;
    correctMalletPosition(circle);
  }
}

function correctMalletPosition(circle){
  // Make sure mallets are on the correct side:
  // Player 1 on the left, player 2 on the right
  if(circle.type == MALLET){
    if(circle.player == PLAYER1){
      if(circle.x > centerX - malletRadius)
        circle.x = centerX - malletRadius;
    }
    else if(circle.player == PLAYER2){
      if(circle.x < centerX + malletRadius)
        circle.x = centerX + malletRadius;
    }
  }
}

canvas.addEventListener("mousemove", function(e){
  pointMove(e.clientX, e.clientY, mouseId);
});

canvas.addEventListener('touchmove',function(e){
  var i;
  for(i = 0; i < e.changedTouches.length; i++){
    var touch = e.changedTouches[i];
    pointMove(touch.pageX, touch.pageY, touch.identifier);
  }
  
  // This is to prevent the default scrolling behavior
  e.preventDefault();
});
  
resetGame();

// Start animation
executeFrame();