const { Router } = require("express");

const apiController = require("../../controllers/api/tourControllers");

const router = Router();

router
    .route("/")
    .get(apiController.getAllTours)
    .post(apiController.createTour);
router
    .route("/:tourId")
    .get(apiController.getTour)
    .patch(apiController.updateTour)
    .delete(apiController.deleteTour);

module.exports = router;
