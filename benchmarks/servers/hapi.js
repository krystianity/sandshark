"use strict";

const Hapi = require("hapi");

const server = new Hapi.Server();
server.connection({
    host: "localhost",
    port: 8080
});

server.route({
    method: "GET",
    path: "/bench/server/test",
    handler: (request, reply) => {
        return reply("minimal-body").code(201).header("bla", "blup");
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log("HAPI server running at:", server.info.uri);
});
