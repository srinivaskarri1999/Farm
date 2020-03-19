const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

////////////////////////////////////////////////////////////
// FILES

// blocking,  Sync way
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `This is what we know about avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('File wirtten.');

// non-blocking, Async way
// fs.readFile('./txt/start.txt','utf-8',(err, data1) => {
//     if(err) return console.log('error is present');
//     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err,data2) => {
//         fs.readFile('./txt/append.txt','utf-8',(err,data3) => {
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8', err => {
//                 console.log('File has been written');
//             })
//         })
//     })

// });

// console.log('reading file...');

////////////////////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    "utf-8"
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    "utf-8"
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {
        query,
        pathname
    } = url.parse(req.url, true);

    //OVERVIEW PAGE
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {
            "content-type": "text/html"
        });

        const cardHtml = dataObj
            .map(ele => replaceTemplate(tempCard, ele))
            .join("");
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);

        res.end(output);
        
        //PRODUCT PAGE
    } else if (pathname === "/product") {
        res.writeHead(200, {
            "content-type": "text/html"
        });

        const productcard = dataObj[query.id];
        const output = replaceTemplate(tempProduct, productcard);

        res.end(output);

        //API PAGE
    } else if (pathname === "/api") {
        res.writeHead(200, {
            "content-type": "application/json"
        });
        res.end(data);

        //NOT FOUND
    } else {
        res.writeHead(404, {
            "Content-type": "text/html",
            "my-own-header": "hello-world"
        });
        res.end("<h1>Page not found<h2>");
    }
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log("server started to listen requests on port 8000");
});