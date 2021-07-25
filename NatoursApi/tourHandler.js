const fs = require("fs");
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAlltours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "succes",
        data: { tours },
    });
};
const createTour = (req, res) => {
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
};
const getTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};
const deleteTour = (req, res) => {
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
};

module.exports = { getAlltours, getTour, updateTour, deleteTour, createTour };
