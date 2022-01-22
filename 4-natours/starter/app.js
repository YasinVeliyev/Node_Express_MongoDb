const fs = require("node:fs");

const express = require("express");
const morgan = require("morgan");
const app = express();

const tourRouter = require("./routes/api/tourRoutes");
const userRouter = require("./routes/api/userRoutes");
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
    console.log("Hello from middleware");
    next();
});
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
