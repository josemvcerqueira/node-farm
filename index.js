const fs = require("fs");
const http = require("http");
const url = require("url");

///////////////////////////////////////////////////////////
// FILES

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
//
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
//
// fs.readFile("./txt/start.txt", "utf-8", (error, data1) => {
// 	fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
// 		fs.readFile(`./txt/append.txt`, "utf-8", (error, data3) => {
// 			fs.writeFile(
// 				"./txt/final.txt",
// 				`${data2}\n${data3}`,
// 				"utf-8",
// 				err => {
// 					console.log("your file has been written");
// 				}
// 			);
// 		});
// 	});
// });
//
// console.log("will read this this file");

///////////////////////////////////////////////////////////
// SERVER

const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
	output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
	output = output.replace(/{%PRODUCT_QUANTITY%}/g, product.quantity);
	output = output.replace(/{%PRODUCT_ORIGIN%}/g, product.from);
	output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
	output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
	output = output.replace(/{%PRODUCT_ID%}/g, product.id);

	if (!product.organic) {
		output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
	}

	return output;
};

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
	const pathName = req.url;

	// Overview page
	if (pathName === "/" || pathName === "/overview") {
		res.writeHead(200, {
			"Content-type": "text/html"
		});

		const cardsHtml = dataObj
			.map(el => replaceTemplate(tempCard, el))
			.join("");

		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

		res.end(output);

		// Product page
	} else if (pathName === "/product") {
		res.end("This is the PRODUCT");
	} else if (pathName === "/api") {
		res.writeHead(200, {
			"Content-type": "application/json"
		});
		res.end(data);

		// API
	} else {
		res.writeHead(404, {
			"Content-type": "text/html",
			"my-own-header": "hello-world"
		});
		res.end("<h1>Page not found!</h1>");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});
