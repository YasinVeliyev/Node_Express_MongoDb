const express = require("express");
const {
    getAlltours,
    getTour,
    updateTour,
    deleteTour,
    createTour,
    checkTourById,
} = require("../controllers/tourHandler");

const tourRouter = express.Router();
tourRouter.param("id", checkTourById);
tourRouter.route("/").get(getAlltours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
