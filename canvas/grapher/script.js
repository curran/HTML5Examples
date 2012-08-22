var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var numPlotSubdivisions = 100;
var tickMarkLength = 8;//in pixels
var t = 0;

var XtickMarkLabelXOffset = -3;
var XtickMarkLabelYOffset = 15;
var YtickMarkLabelXOffset = 7;
var YtickMarkLabelYOffset = 5;

var animate = false;

c.font = "8pt Arial";

if(!location.hash)
  location.hash = "y = sin(x + t)";

var Interval = function(min,max){
  this.min = min;
  this.max = max;
};

var sin = Math.sin;

var equationStr;
var equation = function(x){ 
  return sin(x+t);
};

function setEquation(text){
  equationStr = text;
  var code = [
    'equation = function(x){',
    '  var y = 0;',
    text+';',// e.g. 'y = sin(x)'
    '  return y;',
    '};'
  ].join('\n');
  eval(code);
}

function plotButtonClicked(text){
  location.hash = text;
  animate = true;
  executeFrame();
}

function hashTextChanged(text){
  document.forms['form'].inputbox.value = text;
  setEquation(text);
}

function shareButtonClicked(){
  alert(document.URL);
}


Interval.prototype.projectTo = function(interval, number){
  // normalizedNumber has a value between 0 and 1
  var normalizedNumber = (number - this.min)/(this.max - this.min);
  return normalizedNumber * (interval.max - interval.min) + interval.min;
};

var unit = new Interval(0, 1);

var plot = {
  x: new Interval(-10, 10),
  y: new Interval(-10, 10)
};

var screen = {
  x: new Interval(0, canvas.width),
  y: new Interval(canvas.height, 0)
}

function drawPlot(){
  var i, plotX, plotY, screenX, screenY;
  
  c.clearRect(0,0,canvas.width,canvas.height);
  c.strokeRect(0,0,canvas.width,canvas.height);
  
  // Draw the X axis
  c.beginPath();
  c.moveTo(screen.x.min, plot.y.projectTo(screen.y, 0));
  c.lineTo(screen.x.max, plot.y.projectTo(screen.y, 0));
  c.stroke();
  
  // Draw the X axis tick marks
  for(i = plot.x.min; i < plot.x.max; i++){
    plotX = i;
    
    if( i != 0){
      screenX = plot.x.projectTo(screen.x, plotX);
      screenY = plot.y.projectTo(screen.y, 0);
      c.beginPath();
      c.moveTo(screenX, screenY - tickMarkLength / 2);
      c.lineTo(screenX, screenY + tickMarkLength / 2);
      c.stroke();
      c.fillText(i, 
                 screenX + XtickMarkLabelXOffset, 
                 screenY + XtickMarkLabelYOffset);
    }
  }
  
  // Draw the Y axis tick marks
  for(i = plot.y.min; i < plot.y.max; i++){
    plotY = i;
    
    if( i != 0){
      screenX = plot.x.projectTo(screen.x, 0);
      screenY = plot.y.projectTo(screen.y, plotY);
      c.beginPath();
      c.moveTo(screenX - tickMarkLength / 2, screenY);
      c.lineTo(screenX + tickMarkLength / 2, screenY);
      c.stroke();
      c.fillText(i, 
                 screenX + YtickMarkLabelXOffset, 
                 screenY + YtickMarkLabelYOffset);
    }
  }
  
  // Draw the Y axis
  c.beginPath();
  c.moveTo(plot.x.projectTo(screen.x, 0), screen.y.min);
  c.lineTo(plot.x.projectTo(screen.x, 0), screen.y.max);
  c.stroke();
  
  // Plot the function
  
  c.beginPath();
  for(i = 0; i <= numPlotSubdivisions; i++){
    plotX = unit.projectTo(plot.x, i / numPlotSubdivisions);
    screenX = plot.x.projectTo(screen.x, plotX);
    plotY = equation(plotX);
    screenY = plot.y.projectTo(screen.y, plotY);
    if(i == 0)
      c.moveTo(screenX, screenY);
    else
      c.lineTo(screenX, screenY);
  }
  c.stroke();
}

function executeFrame(){
  if(animate)
    requestAnimFrame(executeFrame);
  
  // Detect changes to the hash portion of the URL
  var hashText = location.hash.substr(1);
  if(hashText != equationStr)
    hashTextChanged(hashText)
  
  t += 0.02;
  drawPlot();
}
executeFrame();

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