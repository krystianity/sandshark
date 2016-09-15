const SandShark = require("./../index.js");
const app = SandShark();

app.use((err, req, res, next) => {
  console.log(req.headers);
  next();
});

app.get("/bla", (req, res, next) => {
  res.status(201);
  res.write("bla bla bla");
  next();
});

app.use((err, req, res, next) => {
  res.end();
});

app.listen(3000, () => {
  console.log("up @ http://localhost:3000");
});
