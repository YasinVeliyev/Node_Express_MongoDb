const Tour = require("../../models/tourModel");

exports.getAllTours = async (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let { page, sort, limit, fields, ...filter } = req.query;
    try {
        const tours = await Tour.find(filter)
            .sort(sort?.split(",").join(" "))
            .select(fields?.split(",").join(" "))
            .skip((page - 1) * limit || 0)
            .limit(+limit || 100);

        if (!tours.length) {
            throw new Error("This page does not exist");
        }
        res.status(200).json({
            status: "success",
            results: tours.length,
            data: tours,
        });
    } catch (error) {
        return res.status(404).json({
            status: "fail",
            error,
        });
    }
};

exports.getTour = async (req, res, next) => {
    try {
        const tour = await Tour.findById(req.params.tourId);
        if (tour) {
            return res.status(200).json({
                status: "success",
                data: tour,
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: "fail",
            message: "Tour not Find",
        });
    }
};

exports.createTour = async (req, res, next) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            newTour,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error,
        });
    }
};

exports.updateTour = async (req, res, next) => {
    try {
        const tour = await Tour.findByIdAndUpdate(
            req.params.tourId,
            { ...req.body },
            { new: true, runValidators: true },
        );
        if (tour) {
            return res.status(200).json({
                status: "success",
                data: tour,
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: "fail",
            message: "Tour not Find",
            error,
        });
    }
};

exports.deleteTour = (req, res, next) => {
    Tour.findByIdAndDelete(req.params.tourId)
        .then(() => {
            res.status(204).json({
                status: "success",
            });
        })
        .catch(err =>
            res.status(404).json({
                status: "fail",
                message: "Tour not Find",
                error: err,
            }),
        );
};

exports.getTourStats = async (req, res, next) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "Tour not Find",
            error,
        });
    }
};

exports.getMonthlyPlan = async (req, res, next) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "Tour not Find",
            error,
        });
    }
};
