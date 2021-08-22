const express = require("express");
const { getAllUsers, getUser, updateUser, createUser, deleteUser } = require("../controllers/userHandler");
const {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    updateMe,
    deleteMe,
} = require("../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signUp", signUp);
userRouter.post("/login", login);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.patch("/resetpassword/:token", resetPassword);
userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
userRouter.post("/updatepassword", protect, updatePassword);
userRouter.post("/updateme", protect, updateMe);
userRouter.post("/deleteme", protect, deleteMe);

module.exports = userRouter;
