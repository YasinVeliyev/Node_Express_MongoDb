const express = require("express");
const morgan = require("morgan");

const app = express();

const tourRouter = require("./routes/api/tourRoutes");
const userRouter = require("./routes/api/userRoutes");

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static("public"));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
