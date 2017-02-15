var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");

// var app = express();
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing


var alreadyReportedScores = []
var MLBhost = 'gd2.mlb.com';
var thisTeamCode = 'det';


//Retrieve notification log for this game
http.createServer(function(request, response) {
	console.log("GET Request on port 8888");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	response.writeHead(200, {"Content-Type": "text/plain"});

	var parentResponse = response;

	var options = {
		host: MLBhost,
		path: calculateGameFilePath()
	};
	var fullNotificationsXML;

	callback = function(response) {
		response.on('data', function(chunk) {
			fullNotificationsXML += chunk;	
		});

		response.on('end', function() {
			fullNotificationsXML = fullNotificationsXML.toString().replace('undefined', '');
			//var xmlSample ="<!--Copyright 2016 MLB Advanced Media, L.P.  Use of any content on this page acknowledges agreement to the terms posted here http://gdx.mlb.com/components/copyright.txt--><notifications modified_date=\"2016-05-08T14:45:44Z\"><game id=\"2016/05/07/texmlb-detmlb-1\" gameday=\"2016_05_07_texmlb_detmlb_1\"><notification inning=\"1\" top=\"Y\" ab=\"1\" pitch=\"0\" seq=\"1\" batter=\"596059\" pitcher=\"460059\" pbp=\"\" uid=\"-1845147899\"><type category=\"lineups\" away=\"140\" home=\"116\" start_time=\"2016/05/07 05:10 PM\"/></notification><notification inning=\"1\" top=\"Y\" ab=\"1\" pitch=\"0\" seq=\"2\" batter=\"596059\" pitcher=\"460059\" pbp=\"\" uid=\"-1845147868\"><player id=\"456167\"/><player id=\"460059\"/><player id=\"596059\"/><player id=\"608577\"/><player id=\"134181\"/><type category=\"game start\" home_pitcher=\"460059\" away_pitcher=\"456167\" batter=\"596059\" batter_avg=\".287\" on_deck=\"608577\" on_deck_avg=\".318\" in_hole=\"134181\" in_hole_avg=\".268\"/></notification><notification inning=\"3\" top=\"N\" ab=\"28\" pitch=\"0\" seq=\"4\" away_team_runs=\"2\" home_team_runs=\"3\" outs=\"3\" batter=\"425902\" pitcher=\"460059\" uid=\"-1057043260\" pbp=\"\"><player id=\"460059\"/><player id=\"519168\"/><player id=\"425902\"/><player id=\"435622\"/><player id=\"519048\"/><type category=\"end inning\" home_pitcher=\"460059\" away_pitcher=\"519168\" batter=\"425902\" batter_avg=\".205\" on_deck=\"435622\" on_deck_avg=\".236\" in_hole=\"519048\" in_hole_avg=\".250\"/></notification><notification inning=\"5\" top=\"N\" ab=\"45\" pitch=\"0\" seq=\"1\" away_team_runs=\"2\" home_team_runs=\"5\" outs=\"3\" batter=\"596059\" pitcher=\"460059\" uid=\"1333141134\" pbp=\"\"><player id=\"460059\"/><player id=\"519168\"/><player id=\"596059\"/><player id=\"596059\"/><player id=\"596059\"/><type category=\"end inning\" home_pitcher=\"460059\" away_pitcher=\"519168\" batter=\"596059\" batter_avg=\".287\" on_deck=\"596059\" on_deck_avg=\".287\" in_hole=\"596059\" in_hole_avg=\".287\"/></notification><notification inning=\"6\" top=\"N\" ab=\"56\" pitch=\"0\" seq=\"1\" away_team_runs=\"7\" home_team_runs=\"5\" outs=\"3\" batter=\"592261\" pitcher=\"543935\" uid=\"452322607\" pbp=\"\"><player id=\"543935\"/><player id=\"452666\"/><player id=\"592261\"/><player id=\"596059\"/><player id=\"596059\"/><type category=\"end inning\" home_pitcher=\"543935\" away_pitcher=\"452666\" batter=\"592261\" batter_avg=\".226\" on_deck=\"596059\" on_deck_avg=\".287\" in_hole=\"596059\" in_hole_avg=\".287\"/></notification><notification inning=\"9\" top=\"N\" ab=\"82\" pitch=\"0\" seq=\"2\" away_team_runs=\"10\" home_team_runs=\"5\" outs=\"3\" pbp=\"\" uid=\"1904430296\"><player id=\"519168\"/><player id=\"594986\"/><type category=\"end game\" winning_team=\"140\" losing_team=\"116\" winning_pitcher=\"519168\" winning_pitcher_win=\"1\" winning_pitcher_loss=\"0\" losing_pitcher=\"594986\" losing_pitcher_win=\"0\" losing_pitcher_loss=\"1\"/></notification></game><team id=\"140\" code=\"tex\"><notification inning=\"1\" top=\"Y\" ab=\"1\" pitch=\"0\" seq=\"1\" away_team_runs=\"1\" home_team_runs=\"0\" outs=\"0\" batter=\"608577\" pitcher=\"460059\" pbp=\"Rougned Odor homers (6) on a line drive to left center field.  \" uid=\"1990180997\"><player id=\"596059\"/><type category=\"lead change\" lead_type=\"lead\" lead_team=\"140\" trail_team=\"116\"/><type category=\"score\"/><type category=\"homerun\" batter=\"596059\"/></notification><notification inning=\"1\" top=\"Y\" ab=\"2\" pitch=\"0\" seq=\"1\" away_team_runs=\"2\" home_team_runs=\"0\" outs=\"0\" batter=\"134181\" pitcher=\"460059\" pbp=\"Nomar Mazara homers (4) on a line drive to right center field.  \" uid=\"-864525940\"><player id=\"608577\"/><type category=\"score\"/><type category=\"homerun\" batter=\"608577\"/></notification><notification inning=\"3\" top=\"N\" ab=\"28\" pitch=\"1\" seq=\"3\" away_team_runs=\"2\" home_team_runs=\"3\" outs=\"2\" batter=\"457454\" pitcher=\"519168\" pbp=\"Pitching Change: Anthony Ranaudo replaces A.  J.   Griffin.  \" uid=\"723039986\"><player id=\"519168\"/><player id=\"456167\"/><type category=\"pitching change\" relief_pitcher=\"519168\" era=\"-\" win=\"0\" loss=\"0\" save=\"0\" bat_order=\"0\" leaving_pitcher=\"456167\"/></notification><notification inning=\"6\" top=\"Y\" ab=\"47\" pitch=\"0\" seq=\"1\" away_team_runs=\"3\" home_team_runs=\"5\" outs=\"0\" batter=\"134181\" pitcher=\"460059\" pbp=\"Nomar Mazara doubles (3) on a sharp line drive to left fielder Justin Upton.   Rougned Odor scores.  \" uid=\"359693750\"><player id=\"596059\"/><type category=\"score\"/></notification><notification inning=\"6\" top=\"Y\" ab=\"48\" pitch=\"0\" seq=\"2\" away_team_runs=\"3\" home_team_runs=\"5\" outs=\"0\" batter=\"134181\" pitcher=\"460059\" pbp=\"\" uid=\"1214914646\"><player id=\"134181\"/><type category=\"runner in scoring position\" batter=\"134181\" avg=\".276\"/></notification><notification inning=\"6\" top=\"Y\" ab=\"48\" pitch=\"0\" seq=\"1\" away_team_runs=\"5\" home_team_runs=\"5\" outs=\"0\" batter=\"425902\" pitcher=\"594986\" pbp=\"Adrian Beltre homers (4) on a fly ball to right field.    Nomar Mazara scores.  \" uid=\"503808544\"><player id=\"608577\"/><player id=\"134181\"/><type category=\"lead change\" lead_type=\"tie\" lead_team=\"140\" trail_team=\"116\"/><type category=\"score\"/><type category=\"homerun\" batter=\"134181\"/></notification><notification inning=\"6\" top=\"Y\" ab=\"51\" pitch=\"0\" seq=\"1\" away_team_runs=\"7\" home_team_runs=\"5\" outs=\"1\" batter=\"462101\" pitcher=\"543935\" pbp=\"Mitch Moreland homers (4) on a fly ball to left center field.   Ian Desmond scores.  \" uid=\"102893055\"><player id=\"435622\"/><player id=\"519048\"/><type category=\"lead change\" lead_type=\"lead\" lead_team=\"140\" trail_team=\"116\"/><type category=\"score\"/><type category=\"homerun\" batter=\"519048\"/></notification><notification inning=\"6\" top=\"N\" ab=\"54\" pitch=\"0\" seq=\"1\" away_team_runs=\"7\" home_team_runs=\"5\" outs=\"0\" batter=\"435079\" pitcher=\"452666\" pbp=\"Pitching Change: Tom Wilhelmsen replaces Anthony Ranaudo.  \" uid=\"256388429\"><player id=\"452666\"/><player id=\"519168\"/><type category=\"pitching change\" relief_pitcher=\"452666\" era=\"9.00\" win=\"1\" loss=\"2\" save=\"0\" bat_order=\"0\" leaving_pitcher=\"519168\"/></notification><notification inning=\"7\" top=\"Y\" ab=\"60\" pitch=\"0\" seq=\"1\" away_team_runs=\"7\" home_team_runs=\"5\" outs=\"2\" batter=\"134181\" pitcher=\"458677\" pbp=\"\" uid=\"963937410\"><player id=\"134181\"/><type category=\"runner in scoring position\" batter=\"134181\" avg=\".276\"/></notification><notification inning=\"7\" top=\"Y\" ab=\"60\" pitch=\"0\" seq=\"1\" away_team_runs=\"9\" home_team_runs=\"5\" outs=\"2\" batter=\"425902\" pitcher=\"458677\" pbp=\"Adrian Beltre homers (5) on a fly ball to left field.   Delino DeShields scores.  \" uid=\"-302718464\"><player id=\"592261\"/><player id=\"134181\"/><type category=\"score\"/><type category=\"homerun\" batter=\"134181\"/></notification><notification inning=\"7\" top=\"N\" ab=\"62\" pitch=\"0\" seq=\"2\" away_team_runs=\"9\" home_team_runs=\"5\" outs=\"0\" batter=\"400121\" pitcher=\"518617\" pbp=\"Pitching Change: Jake Diekman replaces Tom Wilhelmsen.  \" uid=\"-1666862245\"><player id=\"518617\"/><player id=\"452666\"/><type category=\"pitching change\" relief_pitcher=\"518617\" era=\"2.53\" win=\"0\" loss=\"1\" save=\"0\" bat_order=\"0\" leaving_pitcher=\"452666\"/></notification><notification inning=\"8\" top=\"N\" ab=\"69\" pitch=\"0\" seq=\"1\" away_team_runs=\"9\" home_team_runs=\"5\" outs=\"0\" batter=\"543238\" pitcher=\"501817\" pbp=\"Pitching Change: Tony Barnette replaces Jake Diekman.  \" uid=\"1682529853\"><player id=\"501817\"/><player id=\"518617\"/><type category=\"pitching change\" relief_pitcher=\"501817\" era=\"3.65\" win=\"1\" loss=\"2\" save=\"0\" bat_order=\"0\" leaving_pitcher=\"518617\"/></notification><notification inning=\"9\" top=\"Y\" ab=\"74\" pitch=\"0\" seq=\"1\" away_team_runs=\"9\" home_team_runs=\"5\" outs=\"0\" batter=\"592261\" pitcher=\"450275\" pbp=\"\" uid=\"-1627945023\"><player id=\"592261\"/><type category=\"runner in scoring position\" batter=\"592261\" avg=\".221\"/></notification><notification inning=\"9\" top=\"Y\" ab=\"74\" pitch=\"0\" seq=\"1\" away_team_runs=\"10\" home_team_runs=\"5\" outs=\"1\" batter=\"596059\" pitcher=\"450275\" pbp=\"Delino DeShields out on a sacrifice fly to right fielder J.   Martinez.   Bryan Holaday scores.  \" uid=\"-133557836\"><player id=\"592407\"/><type category=\"score\"/></notification><notification inning=\"9\" top=\"N\" ab=\"82\" pitch=\"0\" seq=\"2\" away_team_runs=\"10\" home_team_runs=\"5\" outs=\"2\" batter=\"543238\" pitcher=\"474521\" pbp=\"Pitching Change: Shawn Tolleson replaces Tony Barnette.  \" uid=\"174643387\"><player id=\"474521\"/><player id=\"501817\"/><type category=\"pitching change\" relief_pitcher=\"474521\" era=\"5.73\" win=\"0\" loss=\"1\" save=\"9\" bat_order=\"0\" leaving_pitcher=\"501817\"/></notification></team><team id=\"116\" code=\"det\"><notification inning=\"2\" top=\"N\" ab=\"17\" pitch=\"0\" seq=\"1\" away_team_runs=\"2\" home_team_runs=\"1\" outs=\"2\" batter=\"578428\" pitcher=\"456167\" pbp=\"Anthony Gose triples (2) on a sharp line drive to center fielder Delino DeShields.   Jarrod Saltalamacchia scores.  \" uid=\"906164227\"><player id=\"457454\"/><type category=\"score\"/></notification><notification inning=\"2\" top=\"N\" ab=\"18\" pitch=\"0\" seq=\"2\" away_team_runs=\"2\" home_team_runs=\"1\" outs=\"2\" batter=\"578428\" pitcher=\"456167\" pbp=\"\" uid=\"-147595644\"><player id=\"578428\"/><type category=\"runner in scoring position\" batter=\"578428\" avg=\".250\"/></notification><notification inning=\"3\" top=\"N\" ab=\"26\" pitch=\"0\" seq=\"1\" away_team_runs=\"2\" home_team_runs=\"1\" outs=\"2\" batter=\"457708\" pitcher=\"456167\" pbp=\"\" uid=\"-1114301655\"><player id=\"457708\"/><type category=\"runner in scoring position\" batter=\"457708\" avg=\".239\"/></notification><notification inning=\"3\" top=\"N\" ab=\"27\" pitch=\"0\" seq=\"1\" away_team_runs=\"2\" home_team_runs=\"1\" outs=\"2\" batter=\"592206\" pitcher=\"456167\" pbp=\"\" uid=\"-1085672504\"><player id=\"592206\"/><type category=\"runner in scoring position\" batter=\"592206\" avg=\".376\"/><type category=\"bases loaded\" batter=\"592206\" avg=\".376\"/></notification><notification inning=\"3\" top=\"N\" ab=\"27\" pitch=\"0\" seq=\"1\" away_team_runs=\"2\" home_team_runs=\"3\" outs=\"2\" batter=\"457454\" pitcher=\"456167\" pbp=\"Nick Castellanos singles on a line drive to center fielder Delino DeShields.   Miguel Cabrera scores.    Victor Martinez scores.    Justin Upton to 3rd.  \" uid=\"1888966427\"><player id=\"408234\"/><player id=\"400121\"/><type category=\"lead change\" lead_type=\"lead\" lead_team=\"116\" trail_team=\"140\"/><type category=\"score\"/></notification><notification inning=\"3\" top=\"N\" ab=\"28\" pitch=\"0\" seq=\"2\" away_team_runs=\"2\" home_team_runs=\"3\" outs=\"2\" batter=\"457454\" pitcher=\"456167\" pbp=\"\" uid=\"-1057043322\"><player id=\"457454\"/><type category=\"runner in scoring position\" batter=\"457454\" avg=\".217\"/></notification><notification inning=\"4\" top=\"N\" ab=\"34\" pitch=\"0\" seq=\"1\" away_team_runs=\"2\" home_team_runs=\"3\" outs=\"1\" batter=\"435079\" pitcher=\"519168\" pbp=\"\" uid=\"-2081007635\"><player id=\"435079\"/><type category=\"runner in scoring position\" batter=\"435079\" avg=\".308\"/></notification><notification inning=\"4\" top=\"N\" ab=\"34\" pitch=\"0\" seq=\"1\" away_team_runs=\"2\" home_team_runs=\"5\" outs=\"1\" batter=\"502110\" pitcher=\"519168\" pbp=\"Ian Kinsler homers (6) on a fly ball to left center field.   Anthony Gose scores.  \" uid=\"1392426331\"><player id=\"543238\"/><player id=\"435079\"/><type category=\"score\"/><type category=\"homerun\" batter=\"435079\"/></notification><notification inning=\"5\" top=\"N\" ab=\"43\" pitch=\"0\" seq=\"1\" away_team_runs=\"2\" home_team_runs=\"5\" outs=\"0\" batter=\"457454\" pitcher=\"519168\" pbp=\"\" uid=\"1275882832\"><player id=\"457454\"/><type category=\"runner in scoring position\" batter=\"457454\" avg=\".217\"/></notification><notification inning=\"6\" top=\"Y\" ab=\"49\" pitch=\"0\" seq=\"3\" away_team_runs=\"5\" home_team_runs=\"5\" outs=\"0\" batter=\"425902\" pitcher=\"594986\" pbp=\"Pitching Change: Kyle Ryan replaces Mike Pelfrey.  \" uid=\"-909903181\"><player id=\"594986\"/><player id=\"460059\"/><type category=\"pitching change\" relief_pitcher=\"594986\" era=\"1.98\" win=\"0\" loss=\"0\" save=\"0\" bat_order=\"0\" leaving_pitcher=\"460059\"/></notification><notification inning=\"6\" top=\"Y\" ab=\"52\" pitch=\"0\" seq=\"1\" away_team_runs=\"7\" home_team_runs=\"5\" outs=\"1\" batter=\"462101\" pitcher=\"543935\" pbp=\"Pitching Change: Alex Wilson replaces Kyle Ryan.  \" uid=\"530001990\"><player id=\"543935\"/><player id=\"594986\"/><type category=\"pitching change\" relief_pitcher=\"543935\" era=\"2.25\" win=\"0\" loss=\"0\" save=\"0\" bat_order=\"0\" leaving_pitcher=\"594986\"/></notification><notification inning=\"7\" top=\"Y\" ab=\"58\" pitch=\"0\" seq=\"1\" away_team_runs=\"7\" home_team_runs=\"5\" outs=\"0\" batter=\"596059\" pitcher=\"458677\" pbp=\"Pitching Change: Justin Wilson replaces Alex Wilson.  \" uid=\"-750423967\"><player id=\"458677\"/><player id=\"543935\"/><type category=\"pitching change\" relief_pitcher=\"458677\" era=\"1.50\" win=\"0\" loss=\"0\" save=\"0\" bat_order=\"0\" leaving_pitcher=\"543935\"/></notification><notification inning=\"8\" top=\"Y\" ab=\"66\" pitch=\"0\" seq=\"1\" away_team_runs=\"9\" home_team_runs=\"5\" outs=\"0\" batter=\"435622\" pitcher=\"572403\" pbp=\"Pitching Change: Drew VerHagen replaces Justin Wilson.  \" uid=\"729962917\"><player id=\"572403\"/><player id=\"458677\"/><type category=\"pitching change\" relief_pitcher=\"572403\" era=\"6.23\" win=\"1\" loss=\"0\" save=\"0\" bat_order=\"0\" leaving_pitcher=\"458677\"/></notification><notification inning=\"8\" top=\"N\" ab=\"72\" pitch=\"0\" seq=\"1\" away_team_runs=\"9\" home_team_runs=\"5\" outs=\"1\" batter=\"502110\" pitcher=\"501817\" pbp=\"\" uid=\"-1481089353\"><player id=\"502110\"/><type category=\"runner in scoring position\" batter=\"502110\" avg=\".239\"/></notification><notification inning=\"9\" top=\"Y\" ab=\"73\" pitch=\"0\" seq=\"1\" away_team_runs=\"9\" home_team_runs=\"5\" outs=\"0\" batter=\"592407\" pitcher=\"450275\" pbp=\"Pitching Change: Mark Lowe replaces Drew VerHagen.  \" uid=\"1005538989\"><player id=\"450275\"/><player id=\"572403\"/><type category=\"pitching change\" relief_pitcher=\"450275\" era=\"2.79\" win=\"1\" loss=\"0\" save=\"0\" bat_order=\"0\" leaving_pitcher=\"572403\"/></notification><notification inning=\"9\" top=\"N\" ab=\"81\" pitch=\"0\" seq=\"1\" away_team_runs=\"10\" home_team_runs=\"5\" outs=\"2\" batter=\"457454\" pitcher=\"501817\" pbp=\"\" uid=\"1875801114\"><player id=\"457454\"/><type category=\"runner in scoring position\" batter=\"457454\" avg=\".217\"/></notification><notification inning=\"9\" top=\"N\" ab=\"82\" pitch=\"0\" seq=\"1\" away_team_runs=\"10\" home_team_runs=\"5\" outs=\"2\" batter=\"543238\" pitcher=\"474521\" pbp=\"\" uid=\"1904430265\"><player id=\"543238\"/><type category=\"runner in scoring position\" batter=\"543238\" avg=\".218\"/><type category=\"bases loaded\" batter=\"543238\" avg=\".218\"/></notification></team></notifications>";
			var parseString = require('xml2js').parseString;
			parseString(fullNotificationsXML, function (err, fullNotificationsObj) {
				//console.log(require('util').inspect(fullNotificationsObj, false, null));
				//console.log('about to call getNextScore, prevScoreUID=' + prevScoreUID);
				var scoreText = getNextScore(fullNotificationsObj)
				//console.log('outside the scope of getNextScore, prevScoreUID=' + prevScoreUID);
				console.log(scoreText);
				parentResponse.write(scoreText)

			})
			parentResponse.end();
		});
	}
	console.log("End of response");
    http.request(options, callback).end();	

}).listen(8888);

function calculateGameFilePath() {
	var today = new Date();
	var todayMonth = (today.getMonth() + 1);
	if (todayMonth<10) { todayMonth = '0' + todayMonth};
	var todayDate = today.getDate();
	if (todayDate<10) { todayDate = '0' + todayDate};

	baseURL = '/components/game/mlb/';
	//todayPath = 'year_' + today.getFullYear() + '/month_' + month + '/day_' + date + '/';
	todayPath = 'year_' + '2016' + '/month_' + '07' + '/day_' + '03' + '/';
	console.log('todayPath=' + todayPath);
	notificationURL = 'notifications/notifications_full.xml';
	//gamePath = 'gid_2016_07_03_detmlb_tbamlb_1/';
	gamePath = checkScoreBoardForGameSubDir(baseURL + todayPath);
	composedURL = baseURL + todayPath + gamePath + notificationURL;
	return composedURL;
}

function parseScoreBoardForGameSubDir() {
	//do the actual parsing of the JSON text here, return the subdir name to be used as 'gamePath' later on
}

//need to call this earlier on, then have the main request for the notifications file be in this one's callback
function checkScoreBoardForGameSubDir(composedTodayURL) {
	var scoreBoardResult;
	var scoreBoardRequest = {
		options: {
			host: MLBhost,
			path: composedTodayURL  //looking for miniscoreboard.json in this directory
		},
		callback: function(response) {
			response.on('data', function(chunk) {
				scoreBoardResult += chunk;
			});
			response.on('end', parseScoreBoardForGameSubDir);
		}
	}
	http.request(scoreBoardRequest.options, scoreBoardRequest.callback).end();
}

function getNextScore(fullNotificationsObj) {
	
	//get the right team's notification list
	var teamNodes = [];
	var teamNode;
	var myTeamIsAway;
	teamNodes = fullNotificationsObj.notifications.team;
	if (teamNodes[0].$.code == thisTeamCode) {
		teamNode = teamNodes[0];
		myTeamIsAway = true;
		otherTeamCode = teamNodes[1].$.code;
	} else {
		teamNode = teamNodes[1];
		myTeamIsAway = false;
		otherTeamCode = teamNodes[0].$.code;
	}

	//console.log('length of teamNode.notification: ' + teamNode.notification.length);

	//loop through that notification list to see if there is a score we haven't yet reported
	for (var i = 0; i < teamNode.notification.length; i++) {
		var thisNotification = teamNode.notification[i];
		//console.log('thisNotification: ' + thisNotification);
		if (isThisNotificationAScore(thisNotification)) {
			console.log('loop iteration ' + i + ', alreadyReportedScores =' + alreadyReportedScores);
			console.log('index of this uid in the array=' + alreadyReportedScores.indexOf(thisNotification.$.uid));
			if (alreadyReportedScores.indexOf(thisNotification.$.uid) == -1) {
				alreadyReportedScores.push(thisNotification.$.uid);

				//going to return a score to the client
				var boxScore;
				var inning = ordinal_suffix_of(thisNotification.$.inning);
				if (myTeamIsAway) {
					boxScore = ' [' + inning + ': ' + thisTeamCode.toUpperCase() + ' ' + thisNotification.$.away_team_runs + 
						', ' + otherTeamCode.toUpperCase() + ' ' + thisNotification.$.home_team_runs + ']';	
				}
				else {
					boxScore = ' [' + inning + ': ' + otherTeamCode.toUpperCase() + ' ' + thisNotification.$.away_team_runs + 
						', ' + thisTeamCode.toUpperCase() + ' ' + thisNotification.$.home_team_runs + ']';						
				}
				return thisNotification.$.pbp + boxScore;
			}
		}
	}
	return '';
}


/*
*PMR 5/16/16 attribution: http://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
                          by Salman A from Stack Overflow
*/
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}


//checks the notification object to see if it includes a score
function isThisNotificationAScore(thisNotification) {
	for (var i = 0; i < thisNotification.type.length; i++) {
		if (thisNotification.type[i].$.category == 'score') {
			return true;
		}
	}
	return false;
}   



// app.get('/getResponder',function(request, response) {
// 	console.log("GET Request on port 8000");
// 	var body = request.body;
// 	console.log(body);
// 	console.log(request);
//     response.setHeader("Access-Control-Allow-Origin", "*");
//     response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
// 	response.writeHead(200, {"Content-Type": "text/plain"});
//     response.write('response from server: ' + request.query.clientInput);
//     response.end();
// });
// app.listen(8000);


