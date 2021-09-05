const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");

const bookingController = require("../controllers/bookingController.js");

const bookingRouter = express.Router();

bookingRouter.get("/checkout-session/:tourId", protect, bookingController.getCheckoutSession);

module.exports = bookingRouter;
