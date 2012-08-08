var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var sideLength = canvas.width;

var depth = 5;

function sierpinskiCarpet(x1, y1, sideLength, depth){
  if (depth === 0){
    drawSquare(x1, y1, sideLength);}
  else{
    sideLength *= (1/3);
    var x2 = x1 + sideLength;
    var y2 = y1 + sideLength;
    var x3 = x1 + sideLength * 2;
    var y3 = y1 + sideLength * 2;
    
    sierpinskiCarpet(x1, y1, sideLength, depth - 1);
    sierpinskiCarpet(x1, y2, sideLength, depth - 1);
    sierpinskiCarpet(x1, y3, sideLength, depth - 1);
    sierpinskiCarpet(x2, y1, sideLength, depth - 1);
    sierpinskiCarpet(x2, y3, sideLength, depth - 1);
    sierpinskiCarpet(x3, y1, sideLength, depth - 1);
    sierpinskiCarpet(x3, y2, sideLength, depth - 1);
    sierpinskiCarpet(x3, y3, sideLength, depth - 1);
  }
}

function drawSquare(x1, y1, sideLength){
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x1 + sideLength, y1);
  c.lineTo(x1 + sideLength, y1 + sideLength);
  c.lineTo(x1, y1 + sideLength);
  c.closePath();
  c.fill();
}

sierpinskiCarpet(0, 0, sideLength, depth);