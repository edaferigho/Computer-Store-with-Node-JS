const fs = require('fs')
const http = require('http')
const url = require('url')

const host = '127.0.0.1'
const port = '9000'
const jsonData = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8')
const database = JSON.parse(jsonData)
//console.log(database)

const server = http.createServer((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html')
    const urlQuery = url.parse(req.url,true)
    const path = urlQuery.pathname
    const query = urlQuery.query
    let id = query.id
    
    //console.log(urlQuery);
    if(path==='/products'||path==='/'){
        res.setHeader('Content-Type','text/html')
        res.statusCode=200
        fs.readFile(`${__dirname}/templates/products.html`,'utf-8',(err,data)=>{
            let productOverview = data
            //console.log(productOverview)
            fs.readFile(`${__dirname}/templates/template-cards.html`,'utf-8',(err,data)=>{
                let cardOutput = database.map((element)=>{
                 let output = data.replace(/{%PRODUCTNAME%}/g,element.productName)
                output = output.replace(/{%IMAGE%}/g,element.image)
                output = output.replace(/{%CPU%}/g,element.cpu)
                output = output.replace(/{%RAM%}/g,element.ram)
                output = output.replace(/{%STORAGE%}/g,element.storage)
                output = output.replace(/{%SCREEN%}/g, element.screen)
                output = output.replace(/{%PRICE%}/g,element.price)
                output = output.replace(/{%DESCRIPTION%}/g,element.description)
                output = output.replace(/{%ID%}/g,element.id)
                return output
                
                }).join('')
                //console.log(cardOutput)
                //res.end(cardOutput.toString())
                productOverview = productOverview.replace(/{%CARD%}/,cardOutput)
                res.end(productOverview)
            })
           
        })
       
        
    }
    else if(path==='/computer'&& id<database.length){

        fs.readFile(`${__dirname}/templates/computer.html`,'utf-8',(err,data)=>{
            
               // Replacing the template strings with the actual JSON dta
                let computer = database[id]
                let output = data.replace(/{%PRODUCTNAME%}/g,computer.productName)
                output = output.replace(/{%IMAGE%}/g,computer.image)
                output = output.replace(/{%CPU%}/g,computer.cpu)
                output = output.replace(/{%RAM%}/g,computer.ram)
                output = output.replace(/{%STORAGE%}/g,computer.storage)
                output = output.replace(/{%SCREEN%}/g, computer.screen)
                output = output.replace(/{%PRICE%}/g,computer.price)
                output = output.replace(/{%DESCRIPTION%}/g,computer.description)
                res.end(output)
            
        })
            // res.write('endpoint')
            // res.end()
        
      // Read the template for the products page
        
    }
    // Routing the images
    

    else if((/[\/.](gif|jpg|jpeg|tiff|png)$/i).test(path)){
        fs.readFile(`${__dirname}/data/img${path}`,(err,data)=>{
            res.statusCode =200
        res.setHeader('Content-Type','image/jpeg')
        res.end(data)
        })
        
    }
    else {
        res.statusCode=404
        res.end(`page not found`)
    }

})

server.listen(port,host,()=>{
    console.log(`Computer Store server is listening at ${host}:${port}`)
})
