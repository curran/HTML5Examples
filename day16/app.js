(function animate(){
  requestAnimFrame(animate);
  model.time += 0.05;
  view.drawPlot();
})();