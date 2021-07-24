const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  let start = new Date();
  fs.readFile("./text-file.txt", (err, data) => {
    if (err) {
      console.log(err);
    }
    res.end(data);
  });

  //   const readable = fs.createReadStream("./text-file.txt");
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //   });
  //   readable.on("end", () => {
  //     console.log(start - new Date());
  //     res.end();
  //   });
});

// server.listen(8000);
console.log(require("module").wrapper);
