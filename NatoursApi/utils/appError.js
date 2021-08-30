class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith("4") ? "Fail" : "Error";
        this.isOperational = process.env.NODE_ENV === "development";
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
