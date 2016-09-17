"use strict";

class Response {

  constructor(response){
    this._response = response;
    this._status = 200;
    this._headers = {};
    this._headWritten = false;
  }

  status(status){
    this._status = status;
    return this;
  }

  set(key, value){

    if(this._headWritten){
      throw new Error("Cannot set headers after they were sent.");
    }

    if(typeof key === "string"){
        this._headers[key.toLowerCase()] = value;
        return this;
    }

    if(typeof key === "object"){
      Object.keys(key).forEach(k => {
        this._headers[k.toLowerCase()] = key[k];
      });
      return this;
    }

    throw new Error("set must be called with key, value as strings or a single object.");
  }

  json(object){

    if(typeof object !== "string"){
      object = JSON.stringify(object);
    }

    this.set("content-type", "application/json");
    this.end(object);
  }

  write(chunk, encoding = "utf8", callback = null){

    if(!this._headWritten){
      if(!this.headers["transfer-encoding"]){
        this.set("transfer-encoding", "chunked");
      }
      this._writeHeader();
    }

    if(!callback){
      return this._response.write(chunk, encoding);
    }

    this._response.write(chunk, encoding, callback);
  }

  send(str){
    this.end(str);
  }

  end(str){

    this._writeHeader();

    if(str){
        return this._response.end(str);
    }

    this._response.end();
  }

  _writeHeader(){

    if(this._headWritten){
      return undefined;
    }

    this._headWritten = true;
    this._response.writeHead(this._status, this._headers);
  }

}

module.exports = Response;
