"use strict";

const restify = require("restify");

const server = restify.createServer({
  name: "benchapp",
  version: "1.0.0"
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
//server.use(restify.bodyParser());

server.get("/bench/server/test", (req, res, next) => {
  res.status(201);
  res.header("bla", "blup");
  res.send("minimal-body");
  return next();
});

server.listen(8080, function () {
  console.log("RESTIFY %s listening at %s", server.name, server.url);
});
