const express = require("express");
const morgan = require("morgan");

const { getTime, sayHello } = require("./middleware");
const userRouter = require("./routes/userRouter");
const tourRouter = require("./routes/tourRouter");

const app = express();

app.use(express.json());
app.use(express.static("./public"));
app.use(sayHello);
app.use(getTime);
app.use(morgan("dev"));

//Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
