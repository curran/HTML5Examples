// Utilities

function transform(x, min1, max1, min2, max2){
  // normalizedX is between 0 and 1
  var normalizedX = (x - min1) / (max1 - min1);
  return normalizedX * (max2 - min2) + min2;
}

function sin(x){
  return Math.sin(x);
}

function tan(x){
  return Math.tan(x);
}







model.setEquation("y = sin(x+time)");

// View
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var screenXMin = 0;
var screenXMax = canvas.width;
var screenYMin = canvas.height;
var screenYMax = 0;

function drawPlot(){
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.strokeRect(0, 0, canvas.width, canvas.height);
  
  // Draw the X axis
  var xAxisYPixelCoordinate = transform(
    0, model.plotYMin, model.plotYMax, screenYMin, screenYMax);
  c.beginPath();
  c.moveTo(0, xAxisYPixelCoordinate);
  c.lineTo(canvas.width, xAxisYPixelCoordinate);
  c.stroke();
  
  // Draw the Y axis
  var yAxisXPixelCoordinate = transform(
    0, model.plotXMin, model.plotXMax, screenXMin, screenXMax);
  c.beginPath();
  c.moveTo(yAxisXPixelCoordinate, 0);
  c.lineTo(yAxisXPixelCoordinate, canvas.height);
  c.stroke();
  
  // Draw the function
  var i, plotX, plotY, screenX, screenY;
  c.beginPath();
  for(i = 0; i <= model.numSegments; i++){
    plotX = transform(i, 0, model.numSegments, model.plotXMin, model.plotXMax);
    plotY = model.executeEquation(plotX);
    screenX = transform(plotX, model.plotXMin, model.plotXMax, 
                        screenXMin, screenXMax);
    screenY = transform(plotY, model.plotYMin, model.plotYMax, 
                        screenYMin, screenYMax);
    if(i === 0)
      c.moveTo(screenX, screenY);
    else
      c.lineTo(screenX, screenY);
  }
  c.stroke();
}

// Controller
function plotButtonClicked(text){
    model.setEquation(text);
}

// Main App
model.numSegments = canvas.width;

(function animate(){
  requestAnimFrame(animate);
  model.time += 0.05;
  drawPlot();
})();