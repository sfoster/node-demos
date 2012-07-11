var http = require('http'), 
    fs = require('fs');

var resources = {
  html: ''
};

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

}

fs.readFile('./index.html', function(err, content){
  if(err){
    console.log(err);
    return;
  } 
  resources.html = content.toString();
  init();
});
