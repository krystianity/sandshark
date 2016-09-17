"use strict";

const sandshark = require("./../../index.js");
const app = sandshark();

app.get("/bench/server/test", (req, res) => {
  res.status(201).set("bla", "blup").send("minimal-body");
});

app.listen(8080, () => {
  console.log("SANDSHARK server listening on port 8080.");
});
