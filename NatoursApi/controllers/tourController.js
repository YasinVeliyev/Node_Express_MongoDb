const Tour = require("../models/tourModels");
const AppError = require("../utils/appError");
const { catchAsync } = require("./errorController");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory");

// const getAlltours = catchAsync(async (req, res, next) => {
//     const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//     let tours = await features.query;

//     res.status(200).json({
//         status: "succes",
//         result: tours.length,
//         data: { tours },
//     });
// });

// const createTour = catchAsync(async (req, res, next) => {
//     let newTour = await Tour.create(req.body);
//     res.status(201).json({
//         status: "success",
//         data: {
//             tour: newTour,
//         },
//     });
// });

// const getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id)
//         .populate({
//             path: "guides",
//             select: "-__v -passwordChangedAt",
//         })
//         .populate({ path: "reviews" });
//     if (!tour) {
//         return next(new AppError(404, "Not found with that ID"));
//     }
//     return res.status(200).json({
//         status: "succes",
//         data: { tour },
//     });
// });

// const updateTour = catchAsync(async (req, res, next) => {
//     const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!updatedTour) {
//         return next(new AppError(404, "Not found with that ID"));
//     }
//     res.status(200).json({
//         status: "succes",
//         data: {
//             tour: updatedTour,
//         },
//     });
// });

// const deleteTour = catchAsync(async (req, res, next) => {
//     let tour = await Tour.findByIdAndDelete(req.params.id);
//     if (!tour) {
//         return next(new AppError(404, "Not found with that ID"));
//     }
//     res.status(204).json({
//         status: "success",
//         data: null,
//     });
// });
const getAlltours = getAll(Tour);
const createTour = createOne(Tour);
const getTour = getOne(Tour, true);
const updateTour = updateOne(Tour);
const deleteTour = deleteOne(Tour);

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

const getToursWithin = async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");
    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        return next(new AppError(400, "Please provide latitute and longitute in the format lat,lng"));
    }

    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });
    console.log(tours);
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: { tours },
    });
};
const getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");
    if (!lat || !lng) {
        return next(new AppError(400, "Please provide latitute and longitute in the format lat,lng"));
    }

    const distance = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: "distance",
            },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: { distance },
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
    getToursWithin,
    getDistances,
};
