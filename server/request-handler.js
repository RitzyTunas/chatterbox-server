/* global: handleRequest */
/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
//var handleRequest;


var messageStorage = {
  results: []
};
// exports = {}
exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  // console.log("request/response: ", request.headers, response.headers);


  console.log("Serving request type " + request.method + " for url " + request.url);


  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  if ((request.url).match(/\/classes/gi) === null) {
    var statusCode = 404;
    /* .writeHead() tells our server what HTTP status code to send back */
    response.writeHead(statusCode, headers);
    response.end('File not found!');
  } else if(request.method === "POST") {
    var statusCode = 201;

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/

    var data = "";

    request.on("data", function(chunk) {
        data += chunk;
    });

    request.on("end", function() {
        // console.log(data);
        messageStorage.results.unshift(JSON.parse(data));
        console.log(messageStorage.results);
    });

    response.end();

  } else if(request.method === "GET") {
    var statusCode = 200;

    /* .writeHead() tells our server what HTTP status code to send back */
    response.writeHead(statusCode, headers);

    /* Make sure to always call response.end() - Node will not send
     * anything back to the client until you do. The string you pass to
     * response.end() will be the body of the response - i.e. what shows
     * up in the browser.*/

    //  response.writeHead(200);
    // var message = "";
    // message += messageStorage;
    response.end(JSON.stringify(messageStorage));
    // console.log(messageStorage);
    // response.end();
  // return messageStorage;
  } else {
    var statusCode = 200;

    /* .writeHead() tells our server what HTTP status code to send back */
    response.writeHead(statusCode, headers);

    /* Make sure to always call response.end() - Node will not send
     * anything back to the client until you do. The string you pass to
     * response.end() will be the body of the response - i.e. what shows
     * up in the browser.*/


    response.end("Hello, World!");
  }



};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
exports.handler = exports.handleRequest;

