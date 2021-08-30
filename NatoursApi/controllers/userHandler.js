const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { catchAsync, globalErrorHandler } = require("./errorController");
const { deleteOne, updateOne, getOne, getAll } = require("./handlerFactory");

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/img/users");
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1];
//         console.log(req.user);
//         cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//     },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError(400, "Please upload only images"), false);
    }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadUserPhoto = upload.single("photo");

const checkBody = (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError(400, "This route is not for password updates. Please use /updatepassword"));
    }
    next();
};
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

const filteredOBj = (obj, ...args) => {
    let Obj = { ...obj };
    let newObj = {};
    Array.from(args).forEach((elem) => {
        if (Obj.hasOwnProperty(elem)) {
            newObj[elem] = Obj[elem];
        }
    });
    return newObj;
};

const resizeUserPhoto = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
};

const getUser = getOne(User);
const getAllUsers = getAll(User);
const createUser = (req, res) => {};
const deleteMe = deleteOne(User);

const updateMe = catchAsync(async (req, res, next) => {
    const filteredBody = filteredOBj(req.body, "name", "email");
    if (req.file) {
        filteredBody.photo = req.file.filename;
    }
    const document = await User.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    if (!document) {
        return next(new AppError(404, "Not found with that ID"));
    }
    res.status(201).json({
        status: "succes",
        data: {
            data: document,
        },
    });
});

module.exports = {
    resizeUserPhoto,
    getAllUsers,
    getUser,
    updateMe,
    createUser,
    deleteMe,
    checkBody,
    getMe,
    uploadUserPhoto,
};
