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

## Smiley Face
[run](canvas/smileyFace.html)
<iframe width="150" height="150" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
        src="canvas/smileyFace.html"></iframe>

Drawing a smiley face. This example demonstrates:

 * The concept of paths
 * Drawing circles and arcs using the Canvas functions `beginPath`, `arc`, `fill`, and `stroke`
 * Fill style vs. stroke style

## Hello Text!
[run](canvas/helloText.html)
<iframe width="400" height="70" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/helloText.html"></iframe>

Drawing the text "Hello Text!" in gray with a black stroke. This example demonstrates:

 * Using the Canvas text API
 * Setting the font
 * Setting the stroke style
 * Filling and stroking text

## The Sierpinski Triangle
[run](canvas/sierpinskiTriangle/index.html)
<iframe width="400" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/sierpinskiTriangle/index.html"></iframe>

Drawing the Sierpinski Triangle. This example demonstrates:

 * Drawing polygons
 * Recursive geometric structures

See also the [Sierpinski Carpet](canvas/sierpinskiCarpet/index.html)

## Digital Clock
[run](canvas/digitalClock/index.html)
<iframe width="400" height="70" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/digitalClock/index.html"></iframe>

Drawing the text representing the time of day. This example demonstrates:

 * Periodically clearing and redrawing the canvas using `setInterval`
 * Drawing a background color instead of clearing the canvas to white
 * Using colors picked by hand with [JSColor](http://jscolor.com/)
 * Using the JavaScript Date API
 * Eliminating the margin around the canvas using inline CSS on the `body` tag

## Mouse Follower
[run](canvas/mouseFollower/index.html)
<iframe width="400" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/mouseFollower/index.html"></iframe>

Drawing a circle that follows the mouse. This example demonstrates:

 * Responding to mouse events `mousemove` and `mouseout`

## Bouncing Ball
[run](canvas/bouncingBall/index.html)
<iframe width="400" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/bouncingBall/index.html"></iframe>

A bouncing ball that can be swung around with the mouse. This example demonstrates:

 * Listening for mouse events `mousedown`, `mouseup`, and `mouseenter`
 * Animation using `requestAnimationFrame` (through a [cross-browser shim](http://paulirish.com/2011/requestanimationframe-for-smart-animating/))
 * Bouncing physics
 * Velocity vectors
 * Simulation
 * Drawing lines
 * Animating only when the mouse is over the Canvas

## 1D Wave Simulation
[run](canvas/waveSimulation1D/index.html)
<iframe width="400" height="100" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/waveSimulation1D/index.html"></iframe>

A 1-dimensional numeric simulation of [the Wave equation](http://en.wikipedia.org/wiki/Wave_equation#Investigation_by_numerical_methods). This example demonstrates:

 * Resizing the canvas to the window (or containing iFrame)
 * Visualizing and interacting with a dynamic simulation
 * Transforming (x,y) coordinates between a model space and the display space
 * Using multiple `script` tags

## 2D Wave Simulation
[run](canvas/waveSimulation2D/index.html)
<iframe width="400" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="canvas/waveSimulation2D/index.html"></iframe>

A 2-dimensional numeric simulation of [the Wave equation](http://en.wikipedia.org/wiki/Wave_equation#Investigation_by_numerical_methods). This example demonstrates:

 * An interactive grid
 * Using luminance to visualize values

## Multi-touch Fingerpainting
[run](mobile/multiTouchFingerpainting/index.html)
<iframe width="400" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
        src="mobile/multiTouchFingerpainting/index.html"></iframe>

Multi-touch fingerpainting, where each touch gets its own random color. This example demonstrates:

 * Responding to touch events in iOS devices
 * Tracking stateful objects based on touches
