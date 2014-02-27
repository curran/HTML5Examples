// Create an empty graph data structure.
var graph = {
      nodes:[],
      links:[]
    },

    // Initialize the Barabasi-Albert model.
    // This initializes the graph with two nodes.
    barabasiAlbert = BarabasiAlbert(graph);

    // Initialize the graph layout and visualization.
    graphVis = GraphVis(graph),

    // Initialize the performance visualization.
    performancePlot = PerformancePlot(),

    // The time of the previous tick.
    previousTime = -1,

    // The sample of tick time differences.
    tickTimes = [],

    // The number of samples to take at each step.
    tickSamples = 10,

    // The number of nodes to add for each step.
    // (a "step" is a certain number of nodes)
    nodeStep = 100;

// Start recording times for a graph with
// `nodeStep` nodes. There are 2 nodes added
// by the BarabasiAlbert() initialization.
addNodes(nodeStep - 2);

graphVis.onTick(function(){
  var currentTime = Date.now();
  if(previousTime !== -1){
    tickTimes.push(currentTime - previousTime);

    if(tickTimes.length === tickSamples){
      recordEntry(graph.nodes.length, avg(tickTimes));
      tickTimes.length = 0;
      addNodes(nodeStep);
    }
  }
  previousTime = currentTime;
});

function recordEntry(numNodes, avgTickTime){
  performancePlot.addEntry({
    numNodes: numNodes,
    avgTickTime: avgTickTime
  });
}

function avg(arr){
  return _.reduce(arr, function(memo, num){
    return memo + num;
  }, 0) / arr.length;
}

// Add a number of nodes periodically.
function addNodes(n){
  for(var i = 0; i < n; i++){
    barabasiAlbert.addNode();
  }
  graphVis.update();
}
graphVis.update();

