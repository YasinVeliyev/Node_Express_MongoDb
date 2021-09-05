const multer = require("multer");
const sharp = require("sharp");
const Tour = require("../models/tourModels");
const AppError = require("../utils/appError");
const { catchAsync } = require("./errorController");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError(400, "Please upload only images"), false);
    }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadTourImages = upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 3 },
]);

const resizeTourImages = async (req, res, next) => {
    // console.log(req.files.images, req.params.id);
    if (!req.files || !req.files.images || !req.files.imageCover) {
        console.log("req.body.imageCover");
        return next();
    }
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    req.body.images = [];
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `user-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
            await sharp(file.buffer)
                .resize(500, 500)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);
            req.body.images.push(filename);
        })
    );
    next();
};

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
    resizeTourImages,
    uploadTourImages,
};
