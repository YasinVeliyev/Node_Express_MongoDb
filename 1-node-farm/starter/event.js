const fs = require("node:fs");
const crypto = require("node:crypto");

// process.env["UV_THREADPOOL_SIZE"] = 2;

console.time("Time");
console.time("Time1");
console.time("Time2");
console.time("Time3");
console.time("Time4");

setImmediate(() => {
    console.log("setImmediate");
});
setTimeout(() => {
    console.log("setTimeout");
}, 0);

fs.readFile("./newfile.txt", "utf-8", (err, data) => {
    console.log(data);
    console.log("_______________________________________________________");
    setImmediate(() => {
        console.log("setImmediate 2");
    });
    setTimeout(() => {
        console.log("setTimeout 2");
    }, 10);
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log("Password encrypted");
        console.log("______________________________________________");
        console.timeEnd("Time1");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log("Password encrypted");
        console.log("______________________________________________");
        console.timeEnd("Time2");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log("Password encrypted");
        console.log("______________________________________________");
        console.timeEnd("Time3");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log("Password encrypted");
        console.log("______________________________________________");
        console.timeEnd("Time4");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log("Password encrypted");
        console.log("______________________________________________");
        console.timeEnd("Time");
    });

    process.nextTick(() => console.log("Nextick"));
});

// console.dir("Sync");
// console.log(arguments);
console.log(require("module").wrapper[0]);
