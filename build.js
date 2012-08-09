//cat index.md | marked > index.html
var fs = require('fs');
fs.readFile('index.md', 'ascii', function(err,data){
    fs.writeFile('index.html', require('marked')(data));
});