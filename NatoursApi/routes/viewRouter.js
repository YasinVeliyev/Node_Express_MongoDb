const express = require("express");
const {
    getOverView,
    getTourView,
    getLoginForm,
    getAccount,
    updateUserData,
    getMyTours,
} = require("../controllers/viewController");
const { isLoggedIn, protect, logout } = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const viewRouter = express.Router();

// viewRouter.get("/", );
// viewRouter.use(isLoggedIn);
viewRouter.get("/", bookingController.createBookingCheckout, isLoggedIn, getOverView);
viewRouter.get("/login", getLoginForm);
viewRouter.get("/logout", logout);
viewRouter.get("/tours/:slug", isLoggedIn, getTourView);
viewRouter.get("/me", protect, getAccount);
viewRouter.post("/submit-user-data", protect, updateUserData);
viewRouter.get("/my-tours", protect, getMyTours);

module.exports = viewRouter;
