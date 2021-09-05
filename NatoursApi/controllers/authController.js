const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const Tour = require("../models/tourModels");
const { catchAsync } = require("./errorController");
const AppError = require("../utils/appError");
const { signToken } = require("../utils/generateToken");
const Email = require("../utils/email");
const crypto = require("crypto");

const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
    });
    const url = `${req.protocol}://${req.get("host")}/me`;
    await new Email(newUser, url).sendWelcome();
    const token = signToken(newUser._id);
    res.status(201).json({ status: "succes", token, data: { user: newUser } });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        let error = new AppError(400, "Please provide email and password");
        return next(error);
    }
    const user = await User.findOne({ email }).select("+password");
    if (user && (await user.checkPassword(password, user.password))) {
        const token = signToken(user, res);
        return res.status(200).json({
            status: "success",
            token,
        });
    }

    return next(new AppError(401, "Incorrect email or password"));
});

const protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError(401, "You are not logged in! Please log in to access"));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError(401, "The user belonging token doesnot exist"));
    }
    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError(401, "User recently changed password, Please log in again"));
    }
    req.params.id = decoded.id;
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, "You dont have permission to perfom this action"));
        }
        next();
    };
};

const forgotPassword = catchAsync(async (req, res, next) => {
    if (!req.body.email) {
        return next(new AppError(404, "Please provide email"));
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError(404, "There is no user with email adress"));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to :${resetURL}`;

    try {
        // await sendMail({
        //     email: user.email,
        //     subjetc: "Your Password reset token",
        //     message,
        // });
        await new Email(user, resetURL).sendPasswordReset();
        res.status(200).json({
            status: "succes",
            message: "Token sent to email",
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError(500, "There was an error sending the email.Try again later"));
    }
});
const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
        return next(new AppError(400, "Token is invalid or has expired"));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const token = signToken(user._id);
    return res.status(200).json({
        status: "succes",
        token,
    });
});

const updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError(401, "Your current password is wrong"));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
    const token = signToken(user._id);
    res.status(201).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
});

const isLoggedIn = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {
        let token = req.cookies.jwt;
        try {
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            if (currentUser.changePasswordAfter(decoded.iat)) {
                return next();
            }
            res.locals.user = currentUser;
            return next();
        } catch (error) {
            return next();
        }
    }
    next();
});

const logout = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            res.cookie("jwt", "logout", {
                expires: new Date(Date.now() + 3000),
                httpOnly: true,
            });
            const tours = await Tour.find();
            return res.status(200).render("overview", { title: "All Tours", tours });
        }
    } catch (error) {
        console.error(error);
    }

    res.status(200).json({ status: "success" });
    next();
};

/* const updateMe = catchAsync(async (req, res, next) => {
//     if (req.body.password || req.body.passwordConfirm) {
//         return next(new AppError(400, "This route is not for password updates. Please use /updatepassword"));
//     }
//     const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody(req.body, "name", "email"), {
//         new: true,
//         runValidators: true,
//     });

//     res.status(200).json({
//         status: "succes",
//         data: {
//             updatedUser,
//         },
//     });
// });

// const deleteMe = catchAsync(async (req, res, next) => {
//     await User.findByIdAndUpdate(req.user.id, { active: false });
//     res.status(204).json({ status: "success", data: {} });
// });*/

module.exports = {
    signUp,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    isLoggedIn,
    logout,
};
