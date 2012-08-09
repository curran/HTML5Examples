<link href="markdown.css" rel="stylesheet"></link>
# HTML5 Canvas Code Examples

## Hello Canvas
[run](canvas/helloCanvas.html)
<iframe width="100" height="100" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/helloCanvas.html"></iframe>

Drawing a blue rectangle. This example demonstrates:

 * Getting the canvas 2D context
 * Setting the fill style
 * filling a rectangle
 * using the Canvas pixel coordinate space

## Hello Text!
[run](canvas/helloText.html)
<iframe width="400" height="70" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/helloText.html"></iframe>

Drawing the text "Hello Text!" in gray with a black stroke. This example demonstrates:

 * Using the Canvas text API
 * Setting the font
 * Setting the stroke style
 * Filling and stroking text

## Smiley Face
[run](canvas/smileyFace.html)
<iframe width="150" height="150" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
        src="canvas/smileyFace.html"></iframe>

Drawing a smiley face. This example demonstrates:

 * The concept of paths
 * Drawing circles
 * Fill style vs. stroke style

## Digital Clock
[run](canvas/digitalClock/index.html)
<iframe width="400" height="70" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/digitalClock/index.html"></iframe>

Drawing the text representing the time of day. This example demonstrates:

 * Periodically clearing and redrawing the canvas using `setInterval`
 * Using the JavaScript Date API
 * Eliminating the margin around the canvas using inline CSS on the `body` tag

## Mouse Follower
[run](http://code-hub.org/run/23.12), [source](http://code-hub.org/edit/23.12)
<iframe width="400" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="http://code-hub.org/run/23.12"></iframe>

Drawing a circle that follows the mouse. This example demonstrates:

 * Listening for mouse events `mousemove` and `mouseout`
 * Drawing circles using the Canvas functions `beginPath`, `arc`, and `fill`

## Bouncing Ball
[run](http://code-hub.org/run/24.31), [source](http://code-hub.org/edit/24.31)

<iframe width="400" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="http://code-hub.org/run/24.31"></iframe>

A bouncing ball that can be swung around with the mouse. Animation is paused when the mouse leaves the canvas. This example demonstrates:

 * Listening for mouse events `mousedown`, `mouseup`, and `mouseenter`
 * Bouncing physics
 * Velocity vectors
 * Simulation
 * Drawing lines
 * Animating only when the mouse is over the Canvas

<a href="./fractals/sierpinskiTriangle/index.html">The Sierpinski Triangle</a><br>
<a href="./fractals/sierpinskiCarpet/index.html">The Sierpinski Carpet</a><br>
<a href="./cellularAutomata/waveSimulation1D/index.html">1D Wave Simulation</a><br>
<a href="./cellularAutomata/waveSimulation2D/index.html">2D Wave Simulation</a><br>
