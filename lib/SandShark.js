const http = require("http");

const Request = require("./Request.js");
const Response = require("./Response.js");

class SandShark {

  constructor(){
    this._port = null;
    this._server = http.createServer(this._onRequest.bind(this));
    this._server.maxHeaderCount = 100;
    this._middlewares = {
      use: [],
      head: [],
      get: [],
      post: [],
      put: [],
      patch: [],
      delete: [],
      options: []
    };
    this._middlewareIndex = 0;
    this._middlewareKeys = [];
    this._registerEvents();
  }

  _registerEvents(){

    this._server.on("connection", (connection) => {
      console.log(connection);
    });
  }

  _onRequest(_req, _res){
    const req = new Request(_req);
    const res = new Response(_res);

    //TODO flatten middlewares and call them here
    res.status(201);
    res.set({
      bla: "blup",
      blu: "blip"
    });
    res.json({ hihi: "lol" });
  }

  head(path, middleware){
    this._addMiddleware("head", path, middleware);
  }

  get(path, middleware){
    this._addMiddleware("get", path, middleware);
  }

  post(path, middleware){
    this._addMiddleware("post", path, middleware);
  }

  put(path, middleware){
    this._addMiddleware("put", path, middleware);
  }

  patch(path, middleware){
    this._addMiddleware("patch", path, middleware);
  }

  delete(path, middleware){
    this._addMiddleware("delete", path, middleware);
  }

  options(path, middleware){
    this._addMiddleware("options", path, middleware);
  }

  use(middleware){
    this._addMiddleware("use", "*", middleware);
  }

  _addMiddleware(type, path, middleware){

    if(typeof middleware !== "function"){
      throw new Error("Make sure that middleware is a function, " +
       (typeof middleware) + " is not.");
    }

    this._middlewareIndex++;
    this._middlewares[type].push({
      index: this._middlewareIndex,
      path: path,
      func: middleware
    });
  }

  listen(port = 8080, callback = null){
    this._port = port;
    this._middlewareKeys = Object.keys(this._middlewares);
    this._server.listen(port, () => {
      if(callback){
        callback();
      }
    });
  }

}

function sandSharkFactory(){
  return new SandShark();
}

/*
var express = require("express");
var app = express();

app.get,post,put,delete,patch,head (function(req, res, next))
app.use (function)(err, req, res, next))

app.listen(port, cb)

req: header, query, params (cookies, body)
res: status(), json(), end(), write(), set({}|key,value)
*/

module.exports = sandSharkFactory;
