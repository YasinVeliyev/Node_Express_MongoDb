const express = require("express");
const morgan = require("morgan");
console.log(__dirname);

const { getTime, sayHello } = require("./middleware");
const userRouter = require("./routes/userRouter");
const tourRouter = require("./routes/tourRouter");

const app = express();

app.use(express.json());
app.use(sayHello);
app.use(getTime);
app.use(morgan("dev"));

//Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
