const fs = require("node:fs");

const express = require("express");
const app = express();

app.use(express.json());
// app.get("/", (req, res, next) => {
//   res.status(200).json({ message: "Hello from the server side", app: "Natours" });
// });

// app.post("/", (req, res, next) => {
//   res.send("You can post to this endpoint ... ");
// });
const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8"));

app.get("/api/v1/tours", (req, res, next) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: tours,
    });
});

app.post("/api/v1/tours", (req, res, next) => {
    // req.on("data", (data) => {
    //     console.log(JSON.parse(data.toString()));
    // });
    console.log(req.body);
    res.status(201).send("Done");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
