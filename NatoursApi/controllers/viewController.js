const Tour = require("../models/tourModels");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const { catchAsync } = require("./errorController");
const AppError = require("../utils/appError");

const getOverView = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render("overview", { title: "All Tours", tours });
});

const getTourView = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate("guides");

    if (!tour) {
        return next(new AppError(404, "There is no tour that name"));
    }
    const reviews = await Review.find({ tour: tour._id });
    res.status(200).render("tour", { tour, reviews, title: tour.name });
});

const getLoginForm = catchAsync(async (req, res, next) => {
    res.status(200).render("login", { title: "Login" });
});

const getAccount = async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user._id });
    res.status(200).render("account", { title: "Your Account", length: bookings.length });
};

const updateUserData = async (req, res, next) => {
    let user = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        { new: true, runValidators: true }
    );
    res.status(200).render("account", { user });
};
const getMyTours = async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user._id });
    const tourIds = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });
    console.log(tourIds.length);
    res.status(200).render("overview", { tours, title: "Booked Tours" });
};

module.exports = { getOverView, getTourView, getLoginForm, getAccount, updateUserData, getMyTours };
