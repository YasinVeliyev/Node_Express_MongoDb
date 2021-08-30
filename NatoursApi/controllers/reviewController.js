const Review = require("../models/reviewModel");
const { catchAsync } = require("./errorController");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory");

// const getAllReviews = catchAsync(async (req, res, next) => {
//     let filter;
//     if (req.params.tourId) filter = { tour: req.params.tourId };
//     const reviews = await Review.find(filter);
//     res.status(200).json({
//         status: "succes",
//         result: reviews.length,
//         data: {
//             reviews,
//         },
//     });
// });

const setTourUserId = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

// const createReview = catchAsync(async (req, res, next) => {
//
//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//         status: "succes",
//         data: {
//             newReview,
//         },
//     });
// });

const getReview = getOne(Review);
const getAllReviews = getAll(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);
const createReview = createOne(Review);

module.exports = { getAllReviews, createReview, deleteReview, updateReview, setTourUserId, getReview };
