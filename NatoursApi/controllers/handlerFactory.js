const { catchAsync } = require("./errorController");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError(404, "Not found with that ID"));
        }
        res.status(204).json({
            status: "success",
            data: null,
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        console.log("Params", req.body);
        const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        console.log(document);
        if (!document) {
            return next(new AppError(404, "Not found with that ID"));
        }
        res.status(201).json({
            status: "succes",
            data: {
                data: document,
            },
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        console.log(req.body, req.params);
        let document = await Model.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                data: document,
            },
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) {
            query
                .populate({
                    path: "guides",
                    select: "-__v -passwordChangedAt",
                })
                .populate({ path: "reviews" });
        }
        const doc = await query;

        if (!doc) {
            return next(new AppError(404, "Not found with that ID"));
        }
        return res.status(200).json({
            status: "succes",
            data: { doc },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        let filter;
        console.log(req.query);
        if (req.params.tourId) filter = { tour: req.params.tourId };
        const features = new APIFeatures(Model.find(), req.query).filter().sort().limitFields().paginate();
        let doc = await features.query;

        res.status(200).json({
            status: "succes",
            result: doc.length,
            data: { doc },
        });
    });
