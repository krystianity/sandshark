const spawn = require("child_process").spawn;
const async = require("async");

function runLoadTest(serverName, callback){
  const server = spawn("node", ["benchmarks/servers/" + serverName + ".js"]);
  server.stdout.pipe(process.stdout);
  setTimeout(() => {
    const worker = spawn("node", ["benchmarks/loadtest.js"]);
    let data = "";
    worker.stdout.on("data", (_data) => {
      data += _data;
    });
    worker.on("close", () => {
      worker.kill();
      server.kill();
      setTimeout(() => {
        callback(data);
      }, 1000);
    });
  }, 325);
}

const args = process.argv.slice(2);

if(args[0] !== "all" && args[0] !== "compare"){
  console.log("Benchmarking: " + args[0] + "..");
  runLoadTest(args[0], (data) => {
    console.log(data);
    console.log("..done. \n");
    process.exit(0);
  });
  return;
}

const allServers = ["express", "hapi", "raw", "restify", "sandshark"];
const compareServers = ["raw", "express", "sandshark"];

async.mapLimit(args[0] === "all" ? allServers : compareServers,
 1, (server, callback) => {
  runLoadTest(server, (data) => {
    let obj = JSON.parse(data);
    let res = {};
    res[server] = obj.rps;
    callback(null, res);
  });
}, (err, results) => {

    if(err){
      return console.error(err);
    }

    console.log(results);
});
