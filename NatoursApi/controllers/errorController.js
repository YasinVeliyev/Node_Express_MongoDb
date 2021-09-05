const AppError = require("../utils/appError");

// const sendErroDev = (error, res) => {
//     if (req.originalUrl)
//         if (error.isOperational) {
//             res.status(error.statusCode).json({
//                 status: error.status,
//                 message: error.message,
//                 error,
//                 stack: error.message,
//             });
//         } else {
//             res.status(200).json({ status: "error", message: "Something went very wrong" });
//         }
// };

const sendError = (error, req, res) => {
    if (error.isOperational) {  
        console.log(error);
        if (req.originalUrl.startsWith("/api")) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                error,
                stack: error.message,
            });
        } else {
            return res.status(error.statusCode).render("error", {
                title: "Something went wrong",
                msg: error.stack,
            });
        }
    } else {
        if (req.originalUrl.startsWith("/api")) {
            return res.status(error.statusCode).json({ status: "error", message: "Something went very wrong" });
        }
        return res.status(error.statusCode).render("error", {
            title: "Something went wrong",
            msg: error.message,
        });
    }
};

const handleCastErrorDb = (error) => {
    console.log(error);
    const message = `Invalid ${error.path}:${error.value}`;
    return new AppError(400, message);
};

const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        console.log(err);
        return sendError(err, req, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err, name: err.name, message: err.message };
        if (err.name === "CastError") {
            error = handleCastErrorDb(err);
        }
        sendError(err, req, res);
    }
};

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(err);
        });
    };
};

module.exports = { globalErrorHandler, catchAsync };
