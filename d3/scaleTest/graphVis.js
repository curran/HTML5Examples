// The graph layout and visualization part of the
// scalability test for D3's force layout and SVG rendering.
//
// Draws from http://bl.ocks.org/mbostock/4062045
//
// Curran Kelleher 2/27/2014
function GraphVis(graph){
  var width = 800,
      height = 400,
      force = d3.layout.force()
        .charge(function(d){
          return -d.degree * 5;
        })
        .linkDistance(5)
        .gravity(1)
        .size([width, height]),
      svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height),

      link = svg.selectAll('.link').data(graph.links),
      node = svg.selectAll('circle').data(graph.nodes),

      // Called on each tick.
      onTick = function(){};

  // Updates the force layout with the current graph data,
  // updates the SVG elements to reflect the current
  // graph data.
  //
  // This should only be called when the graph data changes,
  // not on every tick of the layout.
  function update(){

    // Initialize newly added nodes with (x,y) coordinates
    // and make them part of the force layout.
    force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    // Update the selections to reflect the current graph.
    link = svg.selectAll('.link').data(graph.links);
    node = svg.selectAll('circle').data(graph.nodes);

    // Update SVG elements for links and nodes.
    link.enter().append('line')
      .attr('class', 'link');
    link.exit().remove();

    node.enter().append('circle');
    node.attr('r', function(d){
      return Math.sqrt(d.degree);
    });
    node.exit().remove();

    // Add the labels
    var label = svg.selectAll('text').data([
      graph.nodes.length + ' nodes',
      graph.links.length + ' links'
    ]);
    label.enter().append('text')
      .attr('x', 10)
      .attr('y', function(d, i){
        return 10 + i * 20;
      });
    label.text(function(d){return d;});
     
  }

  // This executes for each tick of the force layout (each frame).
  force.on('tick', function() {

    // Assign (x,y) coordinates to SVG elements from 
    // the coordinates computed by the force layout.
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
    node.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

    // Notify an outside listener.
    onTick();
  });

  return {
    update: update,
    onTick: function(callback){
      onTick = callback;
    }
  };
}
