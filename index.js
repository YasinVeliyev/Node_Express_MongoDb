const fs = require('fs');
const http = require('http')
const url = require('url')

// let textSync = fs.readFileSync('./index.html', 'utf-8')
// console.log(textSync)

// let text = fs.readFile('./i5ndex.html', 'utf-8',(err, data)=>{
//     if(err){
//         console.error(err)
//     }
//     else {
//         console.log(data)
//     }
    
// });
// console.log()
// console.log('Reading File....');

const server = http.createServer((req, res)=>{
    const {pathname, query} = url.parse(req.url, true)
    if(pathname=='/overview'){
        res.end('This is Overview')
    }
    else if(pathname == '/product'){
        res.end('Hello from the server')
    }
    else{
        res.writeHead(404)
        res.end('Page not found')
    }
    
});

server.listen(8000,()=>console.log('Server is running on port 8000'))



