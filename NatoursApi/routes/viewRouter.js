const express = require("express");
const { getOverView, getTourView, getLoginForm, getAccount, updateUserData } = require("../controllers/viewController");
const { isLoggedIn, protect } = require("../controllers/authController");

const viewRouter = express.Router();

// viewRouter.get("/", );
// viewRouter.use(isLoggedIn);
viewRouter.get("/", isLoggedIn, getOverView);
viewRouter.get("/login", getLoginForm);
viewRouter.get("/tours/:slug", getTourView);
viewRouter.get("/me", protect, getAccount);
viewRouter.post("/submit-user-data", protect, updateUserData);

module.exports = viewRouter;
