const fs = require("fs");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { catchAsync, globalErrorHandler } = require("./errorController");

const users = JSON.parse(fs.readFileSync("./dev-data/data/users.json"));

const getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        status: "succes",
        data: { users },
    });
});

const getUser = (req, res) => {
    const user = users.find((user) => user.id == req.params.id);
    if (!user) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        });
    }
    return res.status(200).json({
        status: "succes",
        data: { user },
    });
};

const createUser = (req, res) => {};

const updateUser = (req, res) => {};
const deleteUser = (req, res) => {};

module.exports = { getAllUsers, getUser, updateUser, createUser, deleteUser };
