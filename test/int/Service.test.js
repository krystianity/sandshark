"use strict";

const expect = require("expect.js");
const request = require("request");
const SandShark = require("./../../index.js");

describe("Service Integration", function(){

  const app = SandShark();
  const PORT = 34732;
  const BASE_URL = "http://localhost:" + PORT;

  it("should be able to setup a server", function(done){

    app.use((err, req, res, next) => {
      res.status(200).end();
    });

    app.listen(PORT, () => {
      done();
    });
  });

  it("should be able to make an http request and resolve 200", function(done){

    const conf = {
      url: BASE_URL + "/"
    };

    request(conf, (err, res, body) => {
      expect(err).to.be.equal(null);
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

});
