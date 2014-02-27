// Plots the performance at each number of nodes
// for the force layout and rendering.
//
// Draws from http://bl.ocks.org/mbostock/3883245
//
// Curran Kelleher 2/27/2014
function PerformancePlot(){
  var outerWidth = 800,
      outerHeight = 200,
      margin = {top: 10, right: 20, bottom: 20, left: 50},
      width = outerWidth - margin.left - margin.right,
      height = outerHeight - margin.top - margin.bottom,
      svg = d3.select('body').append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
      x = d3.scale.linear()
        .range([0, width]),
      y = d3.scale.linear()
        .range([height, 0]),
      yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(5)
        .outerTickSize(0),
      yAxisG = svg.append('g')
        .attr('class', 'y axis'),
      xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(10)
        .outerTickSize(0),
      xAxisG = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')'),
      line = d3.svg.line()
        .x(function(d) { return x(d.numNodes); })
        .y(function(d) { return y(d.avgTickTime); }),
      path = svg.append('path')
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 1.5);
      data = [];

  yAxisG
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('dy', '1em')
    .style('text-anchor', 'end')
    .text('ms per tick');

  xAxisG
    .append('text')
    .attr('transform', 'translate(' + width + ',0)')
    .attr('dy', '-0.4em')
    .style('text-anchor', 'end')
    .text('number of nodes');

  function update(){
    x.domain(d3.extent(data, function(d) { return d.numNodes; }));
    y.domain(d3.extent(data, function(d) { return d.avgTickTime; }));
    path.datum(data)
      .attr('class', 'line')
      .attr('d', line);
    yAxisG.call(yAxis);
    xAxisG.call(xAxis);
  }

  function addEntry(entry){
    data.push(entry);
    update();
  }

  return { addEntry: addEntry };
}
