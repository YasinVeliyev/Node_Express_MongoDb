const Tour = require("../../models/tourModel");
const AppError = require("../../utils/appError");

exports.getAllTours = async (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let { page, sort, limit, fields, ...filter } = req.query;
    const tours = await Tour.find(filter)
        .sort(sort?.split(",").join(" "))
        .select(fields?.split(",").join(" "))
        .skip((page - 1) * limit || 0)
        .limit(+limit || 100);
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: tours,
    });
};

exports.getTour = async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    if (tour) {
        return res.status(200).json({
            status: "success",
            data: tour,
        });
    }
    next(new AppError("No tour find with that ID", 404));
};

exports.createTour = async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: "success",
        newTour,
    });
};

exports.updateTour = async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.tourId, { ...req.body }, { new: true, runValidators: true });
    if (tour) {
        return res.status(200).json({
            status: "success",
            data: tour,
        });
    }
    next(new AppError("No tour find with that ID", 404));
};

exports.deleteTour = async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.tourId);
    res.status(204).json({
        status: "success",
    });
};

exports.getTourStats = async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingaAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: "$difficulty",
                num: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avgrating: { $avg: "$ratingaAverage" },
                avgprice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
            },
        },
    ]);
    return res.status(200).json({
        status: "success",
        data: stats,
    });
};

exports.getMonthlyPlan = async (req, res, next) => {
    const { year } = req.params;
    const plan = await Tour.aggregate([
        {
            $unwind: "$startDates",
        },
        {
            $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } },
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numTourStarts: { $sum: 1 },
                tours: { $push: "$name" },
            },
        },
        {
            $addFields: { month: "$_id" },
        },
        { $project: { _id: 0 } },
        { $sort: { numTourStarts: -1 } },
    ]);
    return res.status(200).json({
        status: "success",
        results: plan.length,
        data: { plan },
    });
};
