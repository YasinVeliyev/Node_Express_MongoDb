const fs = require("node:fs");

let users = JSON.parse(fs.readFileSync("./dev-data/data/users.json", "utf-8"));

exports.getAllUsers = (req, res, next) => {
    res.status(200).json({
        status: "success",
        results: users.length,
        data: users,
    });
};

exports.createUser = (req, res, next) => {
    const newId = users[users.length - 1].id + 1;
    const newUser = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    res.status(201).json({
        status: "success",
        newUser,
    });
};

exports.getUser = (req, res, next) => {
    let user = users.filter((user) => user._id == req.params.userId);
    if (user.length === 1) {
        return res.status(200).json({
            status: "success",
            data: user,
        });
    }
    return res.status(404).json({
        status: "fail",
        message: "User not Find",
    });
};

exports.updateUser = (req, res, next) => {
    let updatedUser = users.filter((user) => user._id == req.params.userId);
    if (updatedUser.length) {
        return res.status(200).json({
            status: "success",
            data: updatedUser,
        });
    }
    return res.status(404).json({
        status: "fail",
        message: "User not Find",
    });
};

exports.deleteUser = (req, res, next) => {
    users = users.filter((tour) => tour.id != req.params.tourId);
    if (tour.length) {
        return res.status(204).json({
            status: "success",
        });
    }
    return res.status(404).json({
        status: "fail",
        message: "User not Find",
    });
};
