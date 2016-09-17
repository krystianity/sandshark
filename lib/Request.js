"use strict";

const url = require("url");

class Request {

  constructor(request){
    this._request = request;

    this._applyValuesToNester(request);
  }

  _applyValuesToNester(req){
    this.url = req.url;
    this.path = req.url; //TODO
    this.method = req.method;
    this.headers = req.headers;
    this.httpVersion = req.httpVersion;
  }

}

module.exports = Request;
