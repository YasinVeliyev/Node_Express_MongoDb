const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const replaceTemplate = require("./modules/replaceTemplates");
console.log(require("./event"));

const productData = fs.readFileSync(path.join(__dirname, "dev-data/data.json"), "utf-8");
const template = fs.readFileSync(path.join(__dirname, "templates/template.html"), "utf-8");
const overview = fs.readFileSync(path.join(__dirname, "templates/overview.html"), "utf-8");
const product = fs.readFileSync(path.join(__dirname, "templates/product.html"), "utf-8");

let dataObj = JSON.parse(productData);

const server = http.createServer((req, res) => {
    let { pathname, query } = url.parse(req.url, true);

    if (pathname == "/overview" || req.url == "/") {
        res.writeHead(200, {
            "Content-Type": "text/html",
        });
        const cardsHtml = dataObj.map((elem) => replaceTemplate(template, elem)).join(" ");
        return res.end(overview.replace(/{%template%}/g, cardsHtml));
    } else if (pathname == "/product") {
        res.writeHead(200, { "Content-Type": "text/html" });
        let page = dataObj.filter((elem) => elem.id == query.id)[0];
        if (page) {
            return res.end(replaceTemplate(product, page));
        }
        return res.end("<h1>Not Found</h1>");
    } else if (pathname == "/public/product.css") {
        fs.readFile(path.join(__dirname, "public/product.css"), "utf-8", (err, data) => {
            return res.end(data);
        });
    } else if (pathname == "/public/style.css") {
        fs.readFile(path.join(__dirname, "public/style.css"), "utf-8", (err, data) => {
            return res.end(data);
        });
    } else if (pathname === "/api") {
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        return res.end(productData);
    } else {
        res.writeHead(404, {
            "Content-Type": "text/html",
        });
        res.end("<h1>Not Found</h1>");
    }
});

server.listen(process.env.PORT || 3000);
