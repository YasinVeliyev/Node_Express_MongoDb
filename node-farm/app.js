const fs = require('fs');
const http = require('http')
const url = require('url')


function replaceTemplate(temp, product){
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%ID%}/g, product.id)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    if(!product.organic){
        output = output.replace(/{%ORGANIC%}/g, "not-organic")
    }
    // else{
    //     output = output.replace(/{%NOT_ORGANIC%}/g, product.organic)
    // }
    return output
}

const templateOverview  =  fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf8')
const templateProduct  =  fs.readFileSync(`${__dirname}/templates/product.html`, 'utf8')
const tempCard  =  fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8')
const data =  fs.readFileSync(`${__dirname}/data.json`,'utf8')
const dataObj = JSON.parse(data)


const server = http.createServer((req, res)=>{
    const {pathname, query} = url.parse(req.url, true)

    //Overview Page
    if(pathname=='/overview'||pathname=="/"){
        res.writeHead(200, {"Content-type":"text/html"})
        const html = dataObj.map(elem => replaceTemplate(tempCard, elem)).join("")
        let overview = templateOverview.replace(/{%PRODUCT_CARDS%}/g, html)
        res.end(overview)
    }

    //Product Page
    else if(pathname == '/product'){
        res.writeHead(200, {"Content-type":"text/html"})
        const product =dataObj[query.id]
        const output = replaceTemplate(templateProduct, product)
        return res.end(output)   
    }

    else if(req.url==='/style.css'){
        fs.readFile(`${__dirname}/templates/style.css`,'utf8',(err, data)=>{
            res.writeHead(200, {"Content-type":"text/css"})
            return res.end(data)
        })   
    }

    else if(req.url==='/overview.css'){
        fs.readFile(`${__dirname}/templates/overview.css`,'utf8',(err, data)=>{
            res.writeHead(200, {"Content-type":"text/css"})
            return res.end(data)
        })   
    }
    else if(pathname == '/api'){
        fs.readFile(`${__dirname}/data.json`,'utf8', (err, data)=>{
            const productdata = JSON.parse(data)
            res.writeHead(200, {"Content-type": "application/json"})
            res.end(data)
        })
    }
    else{
        res.writeHead(404)
        res.end('Page not found')
    }
    
});

server.listen(8000,()=>console.log('Server is running on port 8000'))
