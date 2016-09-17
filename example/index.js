"use strict";

const SandShark = require("./../index.js");
const app = SandShark();

app.use((err, req, res, next) => {
  console.log("request from " + req.headers.host);
  next();
});

app.get("/bla", (req, res, next) => {
  res.status(200);
  res.send("bla bla bla");
  next();
});

app.use((err, req, res, next) => {
  res.end();
});

app.listen(3000, () => {
  console.log("example up @ http://localhost:3000");
});
