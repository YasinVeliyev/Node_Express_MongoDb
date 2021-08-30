const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookie_parser = require("cookie-parser");

const { getTime, sayHello } = require("./middleware");
const userRouter = require("./routes/userRouter");
const tourRouter = require("./routes/tourRouter");
const reviewRouter = require("./routes/reviewRouter");
const viewRouter = require("./routes/viewRouter");
const AppError = require("./utils/appError");
const { globalErrorHandler } = require("./controllers/errorController");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookie_parser());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

//Routes
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use((req, res, next) => {
    const err = new AppError(404, `Can't find ${req.originalUrl} on this server`);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
