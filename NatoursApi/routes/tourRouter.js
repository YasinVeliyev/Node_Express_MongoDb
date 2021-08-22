const express = require("express");
const {
    getAlltours,
    getTour,
    updateTour,
    deleteTour,
    createTour,
    aliasTopTour,
    getToursStats,
    getMonhtlyPlan,
} = require("../controllers/tourController");

const { protect, restrictTo } = require("../controllers/authController");

const tourRouter = express.Router();
// tourRouter.param("id", checkTourById);
tourRouter.route("/getmonthlyplan/:year").get(getMonhtlyPlan);
tourRouter.route("/tour-stats").get(getToursStats);
tourRouter.route("/top-5-cheap").get(aliasTopTour, getAlltours);
tourRouter.route("/").get(protect, getAlltours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = tourRouter;
