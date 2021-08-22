const Tour = require("../models/tourModels");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const { catchAsync, globalErrorHandler } = require("./errorController");

const getAlltours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    let tours = await features.query;

    res.status(200).json({
        status: "succes",
        result: tours.length,
        data: { tours },
    });
});

const createTour = catchAsync(async (req, res, next) => {
    let newTour = await Tour.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            tour: newTour,
        },
    });
});

const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate({
        path: "guides",
        select: "-__v -passwordChangedAt",
    });
    if (!tour) {
        return next(new AppError(404, "Not found with that ID"));
    }
    return res.status(200).json({
        status: "succes",
        data: { tour },
    });
});

const updateTour = catchAsync(async (req, res, next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTour) {
        return next(new AppError(404, "Not found with that ID"));
    }
    res.status(200).json({
        status: "succes",
        data: {
            tour: updatedTour,
        },
    });
});

const deleteTour = catchAsync(async (req, res, next) => {
    let tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError(404, "Not found with that ID"));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
});

const aliasTopTour = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,difficulty,summary";
    next();
};

const getToursStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        { $match: { ratingsAverage: { $gte: 4.5 } } },
        {
            $group: {
                _id: "$difficulty",
                numTours: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                averageRating: { $avg: "$ratingsAverage" },
                averagePrice: { $avg: "$price" },
                minPirce: { $min: "$price" },
                maxPrice: { $max: "$price" },
            },
        },
        { $sort: { averagePrice: 1 } },
    ]);
    res.status(200).json({
        status: "success",
        data: { stats },
    });
});

const getMonhtlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        { $unwind: "$startDates" },
        { $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
        {
            $group: {
                _id: { $month: "$startDates" },
                numTourStarts: { $sum: 1 },
                tours: { $push: "$name" },
            },
        },
        { $addFields: { month: "$_id" } },
        { $project: { _id: 0 } },
        { $sort: { month: 1 } },
    ]);
    res.status(200).json({
        status: "success",
        data: { plan },
    });
});

module.exports = {
    getAlltours,
    getTour,
    updateTour,
    deleteTour,
    createTour,
    aliasTopTour,
    getToursStats,
    getMonhtlyPlan,
};
