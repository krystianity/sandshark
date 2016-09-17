"use strict";

const loadtest = require("loadtest");
const options = {
    url: "http://localhost:8080/bench/server/test",
    maxRequests: 2500,
    concurrency: 1,
    agentKeepAlive: true
};

loadtest.loadTest(options, (error, result) => {
    console.log("", JSON.stringify(result, null, 2));
});
