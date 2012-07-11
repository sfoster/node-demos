var http = require('http'), 
    fs = require('fs');
    os = require('os'),
    WebSocketServer = require('ws').Server;

var resources = {
  html: ''
};
var connections = [];

function init(){

  var server = http.createServer(function(req, resp){
    console.log("Request for : " + req.url);
    resp.writeHead(200, {
      'Content-Length': resources.html.length,
      'Content-Type': 'text/html'
    });
    resp.write(resources.html);
    resp.end();
  });

  server.listen(8888);
  console.log("HTTP server listening for http connections on port 8888");

  var wss = new WebSocketServer({port: 8080});

  wss.on('connection', function(ws) {
    console.log("new ws connected client: ", ws);

    // store the connected client in an array
    connections.push(ws);

    connections.forEach(function(ws){
      ws.send("There are " + connections.length + " clients connected", function() { /* ignore errors */ });
    });

    ws.on('message', function(message) {
        console.log('received: %s', message);
    });


    ws.on('close', function() {
      var idx = connections.indexOf(ws);
      console.log('client hang up, ' + idx+1 + " of " + connections.length);
      connections.splice(idx, 1);
      connections.forEach(function(ws){
        ws.send("There are now " + connections.length + " clients connected", function() { /* ignore errors */ });
      });
      console.log(connections.length + " remain");
      ws = null;
    });
  });

  console.log("WebSocket server listening for ws connections on port 8080");

  // broadcast memory usage data every 1/2 second
  var itv = setInterval(function() {
    var data = process.memoryUsage(); 
    data.freemem = os.freemem();
    var payload = JSON.stringify(data);
    // send it to all connected clients
    connections.forEach(function(ws){
      ws.send(payload, function() { /* ignore errors */ });
    });
  }, 500);

}

fs.readFile('./index.html', function(err, content){
  if(err){
    console.log(err);
    return;
  } 
  resources.html = content.toString();
  init();
});
