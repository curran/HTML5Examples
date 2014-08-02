// The app is served on this port.
var port = 8000,

    // Express
    express = require("express"),
    app = express(),

    // Socket.io
    http = require("http").Server(app),
    io = require("socket.io")(http);

// Serve static files from our current directory.
app.use("/", express.static(__dirname + "/"));

// Serve real-time content using socket.io.
//
// Draws from example code fount at
// http://socket.io/get-started/chat/
// https://github.com/guille/chat-example

io.on("connection", function(socket){
  console.log("a user connected");
  
  socket.on("message", function (value) {
    console.log("received message " + value);
    io.emit("message", value);
  });
});

http.listen(port, function(){

  // Print a message to the command-line user after the server starts.
  console.log("Now serving http://localhost:"+port);
});
