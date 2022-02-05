const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
    });
};

const handleCastErrorDb = error => {
    const message = `Invalid ${error.path}: ${error.value}. `;
    return new AppError(message, 400);
};

const handleDublicateFields = error => {
    console.log(error.keyValue);
    const message = `Duplicate field value:"${error.keyValue.name}" Please use another value`;
    return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        let error = { ...err, name: err.name };
        if (error.name === "CastError") {
            error = handleCastErrorDb(error);
        }
        if (error.code === 11000) {
            error = handleDublicateFields(error);
        }
        sendErrorProd(error, res);
    }
};
