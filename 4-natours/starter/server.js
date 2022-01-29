/* eslint-disable no-console */
const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

mongoose
    .connect(process.env.DATABASE_LOCAL)
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`App running on port ${port}`);
        });
    })
    .catch(err => {
        console.error(err);
    });
