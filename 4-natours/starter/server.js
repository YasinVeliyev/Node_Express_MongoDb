/* eslint-disable no-console */
const mongoose = require("mongoose");
require("dotenv").config();

process.on("uncaughtException", err => {
    console.error(err.name, err.message);
    process.exit(1);
});

const app = require("./app");

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
    console.log("Db connection successful !");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
process.on("unhandledRejection", err => {
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
