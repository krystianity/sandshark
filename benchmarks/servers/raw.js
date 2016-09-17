"use strict";

const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(201, { "bla": "blup"});
    res.write("minimal-body");
    res.end();
});

server.listen(8080, () => {
  console.log("RAW server listening on port 8080.");
});
