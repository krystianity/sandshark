"use strict";

const express = require("express");
const app = express();

app.get("/bench/server/test", (req, res) => {
  res.status(201).set("bla", "blup").send("minimal-body");
});

app.listen(8080, () => {
  console.log("EXPRESS server listening on port 8080.");
});
