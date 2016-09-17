"use strict";

const http = require("http");

const Request = require("./Request.js");
const Response = require("./Response.js");

const PATH_DELIM = ":";

class SandShark {

  constructor(){
    this._port = null;
    this._server = http.createServer(this._onRequest.bind(this));
    this._server.maxHeaderCount = 100;
    this._middlewares = [];
    this._chains = {
      HEAD: [],
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: [],
      OPTIONS: []
    };
    this._listening = false;

    this._registerEvents();
  }

  _registerEvents(){
    /*
    this._server.on("connection", (connection) => {});
    */
  }

  _onRequest(_req, _res){

    const req = new Request(_req);
    const res = new Response(_res);

    if(this._chains[req.method].length <= 0){
      return res.status(404).end();
    }

    let chainIndex = 0;
    const chain = this._chains[req.method];
    SandShark._recursiveMiddlewareCall(chainIndex, req, res, chain, null, (error) => {

      //chain is through but request was not resolved
      if(!error){
        return res.status(404).end();
      }

      res.status(500).json(error);
    });
  }

  static _recursiveMiddlewareCall(index, req, res, chain, error, callback){

    const oldIndex = index;
    try {
      if(index >= chain.length){
        return callback(error);
      }

      if(chain[index].isGeneric){
        chain[index].func(error, req, res, () => {
          index++;
          SandShark._recursiveMiddlewareCall(index, req, res, chain, error, callback);
        });
        return;
      }

      //TODO use chain[index].hasDelim
      if(chain[index].path === req.path){
        chain[index].func(req, res, () => {
          index++;
          SandShark._recursiveMiddlewareCall(index, req, res, chain, error, callback);
        });
        return;
      }

      index++;
      SandShark._recursiveMiddlewareCall(index, req, res, chain, error, callback);
    } catch(err){

      console.error(err); //TODO remove

      if(oldIndex === index){
        index++;
      }

      SandShark._recursiveMiddlewareCall(index, req, res, chain, err, callback);
    }
  }

  head(path, middleware){
    this._addMiddleware("HEAD", path, middleware);
  }

  get(path, middleware){
    this._addMiddleware("GET", path, middleware);
  }

  post(path, middleware){
    this._addMiddleware("POST", path, middleware);
  }

  put(path, middleware){
    this._addMiddleware("PUT", path, middleware);
  }

  patch(path, middleware){
    this._addMiddleware("PATCH", path, middleware);
  }

  delete(path, middleware){
    this._addMiddleware("DELETE", path, middleware);
  }

  options(path, middleware){
    this._addMiddleware("OPTIONS", path, middleware);
  }

  use(middleware){
    this._addMiddleware("USE", "*", middleware);
  }

  _addMiddleware(type, path, middleware){

    if(typeof middleware !== "function"){
      throw new Error("Make sure that middleware is a function, " +
       (typeof middleware) + " is not.");
    }

    let index = this._middlewares.length + 1;
    this._middlewares.push({
      index: index,
      path: path,
      method: type,
      func: middleware
    });
  }

  _flattenMiddlewaresIntoChains(){

    Object.keys(this._chains).forEach(method =>
      this._middlewares.forEach(middleware => {

        if(middleware.method === "USE"){
          middleware.isGeneric = true;
          this._chains[method].push(middleware);
          return;
        }

        if(middleware.method === method){
          middleware.isGeneric = false;
          if(middleware.path.indexOf(PATH_DELIM) !== -1){
            middleware.hasDelim = true;
          } else {
            middleware.hasDelim = false;
          }
          this._chains[method].push(middleware);
        }
      })
    );
  }

  _onListening(){
    this._listening = true;
    this._flattenMiddlewaresIntoChains();
  }

  listen(port = 8080, callback = null){

    if(this._listening){
      throw new Error("this instance is already listening.");
    }

    this._onListening();

    this._port = port;
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
