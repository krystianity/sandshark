"use strict";

const expect = require("expect.js");
const request = require("request");
const SandShark = require("./../../index.js");

describe("Service Integration", function(){

  const app = SandShark();
  const PORT = 34732;
  const BASE_URL = "http://localhost:" + PORT;

  let path = "/hey/ho/lets/go";
  let statusCode = 200;
  let headers = {
    bla: "blup",
    blu: "blip"
  };
  let body = { hihi: "lol", "wat": 1};

  it("should be able to setup a server", function(done){

    app.use((err, req, res, next) => {
      req.firstUse = "use1";
      next();
    });

    app.get(path, (req, res, next) => {
      res.status(statusCode);
      res.set(headers);
      res.json(body);
    });

    app.post(path, (req, res, next) => {
      res.status(500).end();
    });

    app.use((err, req, res, next) => {
      req.secondUse = "use2";
      next();
    });

    app.get("/request/attributes", (req, res) => {
      res.status(200).set("hey", "sup").json({ first: req.firstUse, second: req.secondUse });
    });

    app.listen(PORT, () => {
      done();
    });
  });

  it("should be able to make an http request and resolve 200", function(done){

    const conf = {
      method: "GET",
      url: BASE_URL + path
    };

    request(conf, (err, res, _body) => {
      expect(err).to.be.equal(null);
      let jbody = JSON.parse(_body);
      expect(res.statusCode).to.be.equal(statusCode);
      expect(res.headers.bla).to.be.equal(headers.bla);
      expect(res.headers.blu).to.be.equal(headers.blu);
      expect(jbody.hihi).to.be.equal(body.hihi);
      done();
    });
  });

  it("should receive 500 for bad post request", function(done){
    request({
      method: "POST",
      url: BASE_URL + path
    }, (err, res, body) => {
        expect(err).to.be.equal(null);
        expect(res.statusCode).to.be.equal(500);
        done();
    });
  });

  it("should receive 404 for non existing method", function(done){
    request({
      method: "HEAD",
      url: BASE_URL
    }, (err, res, body) => {
        expect(err).to.be.equal(null);
        expect(res.statusCode).to.be.equal(404);
        done();
    });
  });

  it("should receive 404 for non existing path", function(done){
    request({
      method: "GET",
      url: BASE_URL + "/i/dont/exist/as/path"
    }, (err, res, body) => {
        expect(err).to.be.equal(null);
        expect(res.statusCode).to.be.equal(404);
        done();
    });
  });

  it("should pull request attributes through middlewares", function(done){
    request({
      method: "GET",
      url: BASE_URL + "/request/attributes"
    }, (err, res, _body) => {
        expect(err).to.be.equal(null);
        expect(res.statusCode).to.be.equal(200);
        expect(res.headers.hey).to.be.equal("sup");
        let jbody = JSON.parse(_body);
        expect(jbody.first).to.be.equal("use1");
        expect(jbody.second).to.be.equal("use2");
        done();
    });
  });
});
