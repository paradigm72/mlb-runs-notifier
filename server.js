var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing

MLBhost = 'gd2.mlb.com'
baseURL = '/components/game/mlb/'
todayPath = 'year_2016/month_05/day_07/'
gamePath = 'gid_2016_05_07_texmlb_detmlb_1/'
notificationURL = 'notifications/notifications_full.xml'
composedURL = baseURL + todayPath + gamePath + notificationURL

//Retrieve notification log for this game
http.createServer(function(request, response) {
	console.log("GET Request on port 8888");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	response.writeHead(200, {"Content-Type": "text/plain"});
	var parentResponse = response;

	var options = {
		host: MLBhost,
		path: composedURL
	};
	var notificationList;

	callback = function(response) {
		response.on('data', function(chunk) {
			notificationList += chunk;
		});

		response.on('end', function() {
			console.log(notificationList);
			parentResponse.write(notificationList);
			parentResponse.end();
		});
	}
	console.log("End of response");
    http.request(options, callback).end();	

}).listen(8888);   



app.get('/getResponder',function(request, response) {
	console.log("GET Request on port 8000");
	var body = request.body;
	console.log(body);
	console.log(request);
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	response.writeHead(200, {"Content-Type": "text/plain"});
    response.write('response from server: ' + request.query.clientInput);
    response.end();
});



app.listen(8000);


