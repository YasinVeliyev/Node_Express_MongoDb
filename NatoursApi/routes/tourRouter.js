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
    getToursWithin,
    getDistances,
    resizeTourImages,
    uploadTourImages,
} = require("../controllers/tourController");

const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("./reviewRouter");

const tourRouter = express.Router();
// tourRouter.param("id", checkTourById);
tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter.route("/getmonthlyplan/:year").get(getMonhtlyPlan);
tourRouter.route("/tour-stats").get(getToursStats);
tourRouter.route("/top-5-cheap").get(aliasTopTour, getAlltours);
tourRouter.route("/").get(getAlltours).post(protect, restrictTo("admin", "lead-guide"), createTour);

tourRouter
    .route("/:tourId")
    .get(getTour)
    .patch(protect, restrictTo("admin", "lead-guide"), uploadTourImages, resizeTourImages, updateTour)
    .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);
tourRouter.get("/tours-distance/:distance/:latlng/unit/:unit", getToursWithin);
tourRouter.route("/distances/:latlng/unit/:unit").get(getDistances);

module.exports = tourRouter;
