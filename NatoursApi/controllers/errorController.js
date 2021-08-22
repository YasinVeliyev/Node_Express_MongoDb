const AppError = require("../utils/appError");

const sendErroProd = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({ status: error.status, message: error.message });
    } else {
        res.status(200).json({ status: "error", message: "Something went very wrong" });
    }
};

const handleCastErrorDb = (error) => {
    const message = `Invalid ${error.path}:${error.value}`;
    return new AppError(400, message);
};

const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let status = err.status || "error";

    // console.log(Object.getOwnPropertyDescriptors(err, "name"));
    if (process.env.NODE_ENV === "development") {
        return res.status(statusCode).json({ status, message: err.message, error: err, stack: err.stack });
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err, name: err.name };
        console.log(error.name);
        if (err.name === "CastError") {
            error = handleCastErrorDb(err);
        }
        sendErroProd(error, res);
    }
};

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = { globalErrorHandler, catchAsync };
