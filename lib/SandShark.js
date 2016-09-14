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
    });
  }

  _onRequest(_req, _res){
    const req = new Request(_req);
    const res = new Response(_res);

    //TODO flatten middlewares and call them here

  }

  head(){
    this._addMiddleware("head", middleware);
  }

  get(){
    this._addMiddleware("get", middleware);
  }

  post(){
    this._addMiddleware("post", middleware);
  }

  put(){
    this._addMiddleware("put", middleware);
  }

  patch(){
    this._addMiddleware("patch", middleware);
  }

  delete(){
    this._addMiddleware("delete", middleware);
  }

  options(middleware){
    this._addMiddleware("options", middleware);
  }

  use(middleware){
    this._addMiddleware(middleware);
  }

  _addMiddleware(type, middleware){

    if(typeof middleware !== "function"){
      throw new Error("Make sure that middleware is a function.");
    }

    this._middlewareIndex++;
    this._middlewares[type].push({
      index: this._middlewareIndex,
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
