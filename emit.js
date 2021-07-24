const EventEmitter = require("events");
const http = require("http");

const myEmitter = new EventEmitter();
myEmitter.on("newSale", () => {
  console.log("There was new sale");
});

myEmitter.on("newSale", () => {
  console.log("Costumer name: Jonas");
});

myEmitter.on("newSale", (stock) => {
  console.log(stock);
});
myEmitter.emit("newSale", 9);

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received");
  res.end("Request received");
});

server.on("request", (req, res) => {
  console.log("Another request");
  //   res.end("Another request");
});

server.on("close", () => {
  console.log("Server close");
});

server.listen(8000, () => console.log("Server start"));
