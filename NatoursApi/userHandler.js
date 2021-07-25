const fs = require("fs");
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`));
// const newusers = users.map((user, index) => {
//     user.id = index;
//     return user;
// });
// fs.writeFileSync(`${__dirname}/dev-data/data/newusers.json`, JSON.stringify(newusers));

const getAllUsers = (req, res) => {
    res.status(200).json({
        status: "succes",
        data: { users },
    });
};

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
