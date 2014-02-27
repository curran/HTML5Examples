// A simple static file server for development use.
//
// Curran Kelleher 2/27/2014
//
// Run with the shell command "node server.js".
// (first install Express with the command "npm install express")
// (first install Node.js, see https://github.com/joyent/node/wiki/Installation
var port = 8000,
    express = require('express'),
    app = express();
app.use('/', express.static(__dirname));
app.listen(port);
console.log('Now serving http://localhost:'+port+'/index.html');
