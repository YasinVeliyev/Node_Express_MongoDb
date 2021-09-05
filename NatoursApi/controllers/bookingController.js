const Tour = require("../models/tourModels");
const Booking = require("../models/bookingModel");
const { catchAsync } = require("./errorController");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    // res.status(200).json({
    //     status: "success",
    //     data: { tour },
    // });
    let url = `${req.protocol}://${req.get("host")}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`;
    console.log(url);
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: url,
            cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
            customer_email: req.user.email,
            client_reference_id: req.params.tourId,
            line_items: [
                {
                    name: `${tour.name} Tour`,
                    description: tour.summary,
                    images: [`http://localhost:3000/img/tours/${tour.imageCover}`],
                    amount: tour.price * 100,
                    currency: "usd",
                    quantity: 1,
                },
            ],
        });
        // session.catch((err) => console.error(err));
        res.status(200).json({
            status: "success",
            data: { session },
        });
    } catch (error) {
        console.error(error);
    }
};

exports.createBookingCheckout = async (req, res, next) => {
    const { tour, user, price } = req.query;
    if (!tour & !user & !price) {
        return next();
    }
    await Booking.create({ tour, user, price });
    res.redirect(req.originalUrl.split("?")[0]);
};
