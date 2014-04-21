// Implements the Barabasi-Albert model for
// incrementally constructung a scale free network
// using a preferential attachment algorithm.
//
// Curran Kelleher 2/27/2014
//
// See http://en.wikipedia.org/wiki/BA_model

function BarabasiAlbert(graph){

  // Adds a new node, returns its index.
  function node(){
    graph.nodes.push({ degree: 0 });
    return graph.nodes.length - 1;
  }

  // Adds a link given two node indices.
  // Increments the degrees of the connected nodes.
  function link(u, v){
    graph.links.push({ "source": u, "target": v });
    graph.nodes[u].degree++;
    graph.nodes[v].degree++;
  }

  // Sums values of the given property from an array.
  function sum(arr, property) {
    return _.reduce(arr, function(memo, entry){
      return memo + entry[property];
    }, 0);
  }

  // Adds a node to the network and links it to other nodes
  // according to the Barabási–Albert model.
  // See http://en.wikipedia.org/wiki/Barab%C3%A1si-Albert_model#Algorithm
  function addNode(){
    var degreeSum = sum(graph.nodes, 'degree'),
        u = node();

    graph.nodes.forEach(function(node, v){
      // `p` is the probability that the new node `u`
      // gets connected to the current node `v`.
      var p = node.degree/degreeSum;

      // Connect the nodes with probability `p`.
      if(Math.random() < p){
        link(u, v);
      }
    });

    // Slight modification to the algorithm:
    // Ensure that each new node is connected to at least
    // one existing node:
    if(graph.nodes[u].degree === 0){
      link(u, Math.floor(Math.random() * (graph.nodes.length - 1)));
    }

    //console.log(JSON.stringify(graph, null, 2));
  }

  // Initialize the graph with two connected nodes.
  link(node(), node());

  return { addNode: addNode };
}
