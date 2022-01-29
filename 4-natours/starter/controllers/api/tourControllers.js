const Tour = require("../../models/tourModel");

exports.getAllTours = async (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let { page, sort, limit, fields, ...filter } = req.query;
    try {
        const tours = await Tour.find(filter)
            .sort(sort?.split(",").join(" "))
            .select(fields?.split(",").join(" "))
            .skip(((page || 1) - 1) * (limit || 0))
            .limit(+limit || 100);
        // if (sort) {
        //     sort = sort.split(",").join(" ");
        //     query = query.sort(sort);
        // }
        // if (fields) {
        //     fields = fields.split(",").join(" ");
        //     query = query.select(fields);
        // }
        // const tours = await query;
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
