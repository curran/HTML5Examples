canvas = automata # from the DOM
ctx = canvas.getContext '2d'

DEAD = 0
ALIVE = 1

# an n X m automata grid
# 
#   * n columns (corresponding to i, x, width)
#   * m rows (corresponding to j, y, height)
q = 6
n = Math.pow 2, q+2
m = Math.pow 2, q

cellWidth = canvas.width / n
cellHeight = canvas.height / m

cells = []

cellAt = (i, j) ->
  i = (i+n) % n
  j = (j+m) % m
  cells[i + j*n]


class Cell
  constructor: (@i, @j) ->
    #status = either 0 or 1, randomly
    @status = DEAD
    @next = DEAD
    @neighbors = []
    
  addNeighbor: (neighbor) ->
    @neighbors.push neighbor
    
  paint: ->
    x = @i * cellWidth
    y = @j * cellHeight
    ctx.fillStyle = if @status then 'white' else 'black'
    ctx.fillRect x, y, cellWidth, cellHeight

createCells = ->
  for j in [0...m]
    for i in [0...n]
      cells.push new Cell i, j

initializeCells = ->
  for c in cells
    c.status = Math.round Math.random()

linkNeighbors = ->
  for cell in cells
    for x in [-1..1]
      for y in [-1..1]
        if (x != 0) || (y != 0)
          i = cell.i + x
          j = cell.j + y
          cell.addNeighbor cellAt i, j
  
render = ->
  _.each cells, (cell) -> cell.paint()
 
  #Any live cell with fewer than two live neighbours dies, as if caused by under-population.

  #Any live cell with two or three live neighbours lives on to the next generation.

  #Any live cell with more than three live neighbours dies, as if by overcrowding.

  #Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 
iterate = ->
  for c in cells
    neighbors = 0
    neighbors += neighbor.status for neighbor in c.neighbors
    if (c.status == ALIVE) and (neighbors < 2)       then c.next = DEAD
    if (c.status == ALIVE) and (2 <= neighbors <= 3) then c.next = ALIVE
    if (c.status == ALIVE) and (neighbors > 3)       then c.next = DEAD
    if (c.status == DEAD)  and (neighbors == 3)      then c.next = ALIVE
  for c in cells
    c.status = c.next
 

keepGoing = false

start = ->
  keepGoing = true
  executeFrame()
  
stop = -> keepGoing = false

executeFrame = ->
  iterate()
  render()
  if keepGoing
    requestAnimationFrame executeFrame

createCells()
linkNeighbors()
initializeCells()

canvas.addEventListener 'mouseover', start
canvas.addEventListener 'mouseout', stop
canvas.addEventListener 'mousedown', initializeCells

executeFrame() for i in [0..5]

setInterval (-> executeFrame() if not keepGoing), 1000
