class Response {

  constructor(response){
    this._response = response;
  }

  status(status){
    this._response.writeHead(status, {}); //TODO should we really call this here
    return this;
  }

  set(key, value){

    if(typeof key === "string"){
        return this._response.setHeader(key, value);
    }

    if(typeof key === "object"){
      Object.keys(key).forEach(k => {
        this._response.setHeader(k, key[k]);
      });
      return undefined;
    }

    throw new Error("set must be called with key, value as strings or a single object.");
  }

  json(object){

    if(typeof object !== "string"){
      object = JSON.stringify(object);
    }

    this.set("Content-Type", "application/json");
    this.end(object);
  }

  write(){

  }

  send(){

  }

  end(str){

    if(str){
        return this._response.end(str);
    }

    this._response.end();
  }

}

module.exports = Response;
