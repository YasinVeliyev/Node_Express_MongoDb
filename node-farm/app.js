const fs = require('fs');
const http = require('http')
const url = require('url')

const server = http.createServer((req, res)=>{
    const pathname = req.url;
    if(pathname=='/overview'){
        res.end('This is Overview')
    }
    else if(pathname == '/product'){
        res.end('Hello from the server')
    }
    else if(pathname == '/api'){
        fs.readFile(`${__dirname}/data.json`,'utf8', (err, data)=>{
            console.log(data)
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
