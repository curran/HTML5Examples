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



// Main App
model.numSegments = canvas.width;

(function animate(){
  requestAnimFrame(animate);
  model.time += 0.05;
  view.drawPlot();
})();

