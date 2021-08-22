const Review = require("../models/reviewModel");
const { catchAsync } = require("./errorController");

const getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: "succes",
        result: reviews.length,
        data: {
            reviews,
        },
    });
});

const createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: "succes",
        data: {
            newReview,
        },
    });
});

module.exports = { getAllReviews, createReview };
