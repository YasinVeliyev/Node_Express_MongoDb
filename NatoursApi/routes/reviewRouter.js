const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");

const {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourUserId,
    getReview,
} = require("../controllers/reviewController");
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.route("/").get(getAllReviews).post(protect, setTourUserId, restrictTo("user"), createReview);
reviewRouter
    .route("/:id")
    .get(getReview)
    .delete(protect, restrictTo("user", "admin"), deleteReview)
    .patch(protect, restrictTo("user", "admin"), updateReview);

module.exports = reviewRouter;
