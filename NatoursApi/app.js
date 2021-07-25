const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// app.get("/", (req, res) => {
//     res.status(200).json({ message: "Hello form Server Side", app: "Natours" });
// });

// app.post("/", (req, res) => {
//     res.send("Yo can post to this endpoint...");
// });

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "succes",
        data: { tours },
    });
});

app.post("/api/v1/tours", (req, res) => {
    console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err, data) => {
        if (err) {
            return res.send(err);
        }
        return res.status(201).json({
            status: "success",
            data: {
                tour: newTour,
            },
        });
    });
});

app.get("/api/v1/tours/:id", (req, res) => {
    let tour = tours.find((tour) => tour.id == req.params.id);
    console.log(tour);
    if (!tour) {
        console.log(tour);
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        });
    }

    return res.status(200).json({
        status: "succes",
        data: { tour },
    });
});

app.patch("/api/v1/tours/:id", (req, res) => {
    let tour = tours.find((tour) => tour.id == req.params.id);
    if (!tour) {
        console.log(tour);
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        });
    }
    const updatedTour = Object.assign(tour, req.body);
    tours.push(updatedTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err, data) => {
        if (err) {
            return res.send(err);
        }
        return res.status(201).json({
            status: "success",
            data: {
                tour: updatedTour,
            },
        });
    });
});

app.delete("/api/v1/tours/:id", (req, res) => {
    let updatedTours = tours.filter((tour) => tour.id != req.params.id);
    if (!updatedTours) {
        console.log(tour);
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        });
    }
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(updatedTours), (err, data) => {
        if (err) {
            return res.send(err);
        }
        return res.status(204).json({
            status: "success",
            data: null,
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
