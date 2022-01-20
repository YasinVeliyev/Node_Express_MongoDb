const fs = require("node:fs");
const server = require("node:http").createServer();

server.on("request", (req, res) => {
    fs.readFile("./newfile.txt", (err, data) => {
        if (err) return console.error(err);
        res.end(data);
    });
});

server.listen(8000);
