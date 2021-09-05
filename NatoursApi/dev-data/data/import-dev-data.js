const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/tourModels");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

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

// const tours = JSON.parse(fs.readFileSync("tours.json", "utf-8"));
// const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
// const reviews = JSON.parse(fs.readFileSync("./reviews.json", "utf-8"));

// const importData = async () => {
//     try {
//         await Tour.create(...tours);
//         // await User.create(...users);
//         // await Review.create(...reviews);
//         console.log("Data successfulyy loaded");
//     } catch (error) {
//         console.log(error);
//     }
//     process.exit();
// };

// const deleteData = async () => {
//     await Tour.deleteMany();
//     // await User.deleteMany();
//     // await Review.deleteMany();
//     console.log("Data successfulyy deleted");
//     importData();
// };

// deleteData();
Tour.findById("612e7b438331854c3f4be51a", (err, data) => {
    console.log(data);
});
