const getTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
};

const sayHello = (req, res, next) => {
    console.log("Hello from Middleware");
    next();
};

module.exports = { getTime, sayHello };
