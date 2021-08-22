const express = require("express");
const morgan = require("morgan");

const { getTime, sayHello } = require("./middleware");
const userRouter = require("./routes/userRouter");
const tourRouter = require("./routes/tourRouter");
const reviewRouter = require("./routes/reviewRouter");
const AppError = require("./utils/appError");
const { globalErrorHandler } = require("./controllers/errorController");

const app = express();

app.use(express.json());
app.use(express.static("./public"));
// app.use(sayHello);
// app.use(getTime);
app.use(morgan("dev"));

//Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use((req, res, next) => {
    const err = new AppError(404, `Can't find ${req.originalUrl} on this server`);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
