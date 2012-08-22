var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var centerX = canvas.width / 2;

var trunkHeight = 100;
var branchLengthRatio = 0.75;
var branchAngleDifference = 0.27;
var branchingDepth = 10;

function drawTree(x1, y1, x2, y2, branchLength,
                  branchAngle, depth){
  if(depth == 0)
    return;
  else{
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.closePath();
    c.stroke();
    
    branchLength *= branchLengthRatio;
    
    function branch(angle){
      var branchX2 = x2 + branchLength * Math.cos(angle);
      var branchY2 = y2 + branchLength * Math.sin(angle);
      drawTree(x2, y2, branchX2, branchY2, branchLength,
               angle, depth - 1);
    }
    
    // Right branch
    branch(branchAngle + branchAngleDifference);
    
    // Left branch
    branch(branchAngle - branchAngleDifference);
  }
}

function redrawTree(){
  
  c.clearRect(0,0, canvas.width, canvas.height);
  
  var x1 = centerX;
  var y1 = canvas.height;
  var x2 = centerX;
  var y2 = canvas.height - trunkHeight;
  drawTree(x1, y1, x2, y2, trunkHeight,
           - Math.PI / 2, branchingDepth);
}

canvas.addEventListener("mousemove",function(e){
  branchLengthRatio = e.x / 300;
  branchAngleDifference = e.y / canvas.height * Math.PI;
  redrawTree();
  console.log("branchLengthRatio = "+branchLengthRatio);
  console.log("branchAngleDifference = "+branchAngleDifference);
});

redrawTree();