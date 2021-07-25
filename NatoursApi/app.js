const express = require("express");
const morgan = require("morgan");

const { getAlltours, getTour, updateTour, deleteTour, createTour } = require("./tourHandler");
const { getTime, sayHello } = require("./middleware");
const { getAllUsers, getUser, updateUser, createUser, deleteUser } = require("./userHandler");

const app = express();

app.use(express.json());
app.use(sayHello);
app.use(getTime);
app.use(morgan("dev"));

app.route("/api/v1/tours").get(getAlltours).post(createTour);
app.route("/api/v1/tours/:id").get(getTour).patch(updateTour).delete(deleteTour);

app.route("/api/v1/users").get(getAllUsers).post(createUser);
app.route("/api/v1/users/:id").get(getUser).patch(updateUser).delete(deleteUser);

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
