const mongoose = require("mongoose");
const Tour = require("./tourModels");

const reviewScheam = new mongoose.Schema(
    {
        review: { type: String, required: [true, "Review can not be empty"] },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
        tour: { type: mongoose.Schema.ObjectId, ref: "Tour", required: true },
        user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewScheam.index({ tour: 1 });
reviewScheam.index({ user: 1 });
reviewScheam.pre(/^find/, function (next) {
    this.populate({ path: "user", select: "name photo" }).populate({ path: "tour", select: "name" });
    next();
});

reviewScheam.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        { $match: { tour: tourId } },
        {
            $group: {
                _id: "$tour",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);
    if (stats[0]) {
        await Tour.findByIdAndUpdate(tourId, { ratingsQuantity: stats[0].nRating, ratingsAverage: stats[0].avgRating });
    }
};
reviewScheam.post("save", function () {
    this.constructor.calcAverageRatings(this.tour);
});

reviewScheam.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});
reviewScheam.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.tour._id);
});

const Review = mongoose.model("Review", reviewScheam);
module.exports = Review;
