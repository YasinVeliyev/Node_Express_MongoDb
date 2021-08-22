const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours.json`));

const checkTourById = (req, res, next, val) => {
    let tour = tours.find((tour) => tour.id == val);
    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        });
    }
    req.tour = tour;
    next();
};

const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "fail",
            message: "Missing name or price",
        });
    }
    next();
};

const getAlltours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "succes",
        data: { tours },
    });
};

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile("./dev-data/data/tours-simple.json", JSON.stringify(tours), (err, data) => {
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
};

const getTour = (req, res) => {
    return res.status(200).json({
        status: "succes",
        data: { tour: req.tour },
    });
};

const updateTour = (req, res) => {
    const updatedTour = Object.assign(req.tour, req.body);
    tours.push(updatedTour);
    fs.writeFile("./dev-data/data/tours-simple.json", JSON.stringify(tours), (err, data) => {
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
};

const deleteTour = (req, res) => {
    let updatedTours = tours.filter((tour) => tour.id != req.params.id);
    fs.writeFile(`./dev-data/data/tours-simple.json`, JSON.stringify(updatedTours), (err, data) => {
        if (err) {
            return res.send(err);
        }
        return res.status(204).json({
            status: "success",
            data: null,
        });
    });
};

module.exports = { getAlltours, getTour, updateTour, deleteTour, createTour, checkTourById, checkBody };
