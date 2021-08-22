const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/tourModels");

dotenv.config({ path: "./../../config.env" });
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection is successfuly");
    });

const tours = JSON.parse(fs.readFileSync("./tours.json", "utf-8"));
const importData = async () => {
    try {
        await Tour.create(...tours);
        console.log("Data successfulyy loaded");
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

const deleteData = async () => {
    await Tour.deleteMany();
    console.log("Data successfulyy deleted");
    importData();
};

console.log(tours.length);
deleteData();
