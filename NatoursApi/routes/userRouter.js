const express = require("express");
const { getAllUsers, getUser, updateUser, createUser, deleteUser } = require("../controllers/userHandler");

const userRouter = express.Router();
userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
