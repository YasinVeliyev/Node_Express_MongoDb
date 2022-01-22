const fs = require("node:fs");

const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8"));

exports.getAllTours = (req, res, next) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: tours,
    });
};

exports.getTour = (req, res, next) => {
    let tour = tours.filter((tour) => tour.id == req.params.tourId);
    if (tour.length === 1) {
        return res.status(200).json({
            status: "success",
            data: tour,
        });
    }
    return res.status(404).json({
        status: "fail",
        message: "Tour not Find",
    });
};

exports.createTour = (req, res, next) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    res.status(201).json({
        status: "success",
        newTour,
    });
};

exports.updateTour = (req, res, next) => {
    let tour = tours.filter((tour) => tour.id == req.params.tourId);
    if (tour.length === 1) {
        return res.status(200).json({
            status: "success",
            data: tour,
        });
    }
    return res.status(404).json({
        status: "fail",
        message: "Tour not Find",
    });
};

exports.deleteTour = (req, res, next) => {
    let tour = tours.filter((tour) => tour.id != req.params.tourId);
    if (tour.length) {
        return res.status(204).json({
            status: "success",
        });
    }
    return res.status(404).json({
        status: "fail",
        message: "Tour not Find",
    });
};
