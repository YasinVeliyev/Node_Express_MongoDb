const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: [true, "Tour name must unique"],
            trim: true,
            maxlength: [40, "A tour name must have less or equal 40 characters"],
            minlength: [10, "A tour name must have more or equal 10 characters"],
            // validate: [validator.isAlpha, "Tour name must only contain characters"],
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            max: [5, "Rating must be less or equal 5"],
            min: [0, "Rating must be more or equal 0"],
        },
        ratingsQuantity: { type: Number, default: 0, min: [0, "Ratings Quantity must be more or equal 0"] },
        price: {
            type: Number,
            required: [true, "A tour must have a price"],
            min: [0, "Rating must be more or equal 0"],
        },
        duration: { type: Number, required: [true, "A tour must have a duration"] },
        maxGroupSize: { type: Number, required: [true, "A tour must have a group size"] },
        difficulty: {
            type: String,
            required: [true, "A tour must have a difficulty"],
            enum: { values: ["easy", "medium", "difficult"], message: "Difficulty is either:easy, medium, difficult" },
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(value) {
                    return this.price >= value;
                },
                message: "Discount price ({VALUE}) should be below regular price",
            },
        },
        summery: { type: String, trim: true },
        description: { type: String, trim: true, required: [true, "A tour must have a description"] },
        imageCover: { type: String, required: [true, "A tour must have a cover image"] },
        images: [String],
        createdAt: { type: Date, default: Date.now },
        startDates: [Date],
        slug: { type: String, unique: true },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

tourSchema.virtual("durationWeeks").get(function() {
    return this.duration / 7;
});

tourSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.post("save", function(doc, next) {
//     next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
