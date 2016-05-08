var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
//const MLBBoxScores = require('mlbboxscores');

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing
var mlbOptions = { path: 'year_2011/month_07/day_23'};


//Test basic HTTP connectivity
http.createServer(function(request, response) {
	console.log("GET Request on port 8888");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	response.writeHead(200, {"Content-Type": "text/plain"});

	//var mlbboxscores = new MLBBoxScores(mlbOptions);
	//mlbboxscores.get(function(err, boxscores) {
	//	console.log(boxscores);
	//});

	response.write("Hello World");
	response.end();
}).listen(8888);   



app.get('/getResponder',function(request, response) {
    //request.setHeader("Access-Control-Allow-Origin", "*");
    //request.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	console.log("GET Request on port 8000");
	//var value = request.value;
	var body = request.body;
	console.log(body);
	console.log(request);
    //console.log(value);
	//console.log(input.value);
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	response.writeHead(200, {"Content-Type": "text/plain"});
    response.write('response from server: ' + request.query.clientInput);
    response.end();
});

app.post('/postResponder',function(request, response) {
	console.log("POST Request on port 8000");
	//var value = request.value;
	//var params = request.params;
	var body = request.body;
	console.log(body);
	//console.log(params);
	console.log(request);
    //console.log(value);
	//console.log(input.value);
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	response.writeHead(200, {"Content-Type": "text/plain"});
    response.write('you told us' + request.value);
    response.end();
});

app.listen(8000);


