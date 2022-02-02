const { Router } = require("express");

const apiController = require("../../controllers/api/tourControllers");

const router = Router();

router
    .route("/")
    .get(apiController.getAllTours)
    .post(apiController.createTour);
router.route("/tour-stats").get(apiController.getTourStats);
router.route("/monthly-plan/:year").get(apiController.getMonthlyPlan);
router
    .route("/:tourId")
    .get(apiController.getTour)
    .patch(apiController.updateTour)
    .delete(apiController.deleteTour);

module.exports = router;
