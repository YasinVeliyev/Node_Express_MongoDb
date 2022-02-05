const { Router } = require("express");

const apiController = require("../../controllers/api/tourControllers");
const catchAsync = require("../../utils/catchAsync");
const router = Router();

router
    .route("/")
    .get(catchAsync(apiController.getAllTours))
    .post(catchAsync(apiController.createTour));
router.route("/tour-stats").get(catchAsync(apiController.getTourStats));
router.route("/monthly-plan/:year").get(catchAsync(apiController.getMonthlyPlan));
router
    .route("/:tourId")
    .get(catchAsync(apiController.getTour))
    .patch(catchAsync(apiController.updateTour))
    .delete(catchAsync(apiController.deleteTour));

module.exports = router;
