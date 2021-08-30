const express = require("express");
const multer = require("multer");
const {
    getAllUsers,
    getUser,
    updateMe,
    createUser,
    deleteMe,
    checkBody,
    getMe,
    uploadUserPhoto,
    resizeUserPhoto,
} = require("../controllers/userHandler");
const {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictTo,
    logout,
} = require("../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signUp", signUp);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.patch("/resetpassword/:token", resetPassword);
userRouter.route("/").get(protect, restrictTo("admin"), getAllUsers).post(createUser);
userRouter.get("/me", protect, getMe, getUser);
userRouter.route("/:id").get(getUser);
userRouter.patch("/updatepassword", protect, updatePassword);
userRouter.patch("/updateme", protect, checkBody, uploadUserPhoto, resizeUserPhoto, updateMe);
userRouter.post("/deleteme", protect, deleteMe);

module.exports = userRouter;
