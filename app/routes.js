var api = require('../app/api');
var database = require('../app/database');
var mock = require('../app/mock');

var test = function (req, res) {
    res.send("test");
}


var getEnhet = function(req, res) {
	var orgnr = req.params.orgnr;
	api.getEnhet(orgnr,function (error,result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(result));
		}
	});
};

var getUser = function (req, res) {
  	var email = req.user._json.email;
	database.getUser(email,function(error,result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			req.session.user = result[0];
			res.end(JSON.stringify(result[0]));
		}
	});
};

var addUser = function (req, res) {
	database.addUser(user, function (error,result) {
		 if(error) {
		 	res.writeHead(500, {'Content-Type': 'text/plain'});
		 	res.end(error.message);
		 } else {
		 	res.writeHead(200, {'Content-Type': 'application/json'});
		    res.end(JSON.stringify(result));
		 }
	});
}

var addEnhet = function (req, res) {
	var orgnr = req.params.orgnr;
	database.addEnhet(req.session.user.id,orgnr, function (error,result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {

			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(result));
		}
	});
}

var getDbEnhet = function (req, res) {
	var orgnr = req.params.orgnr;
	database.getEnhet(orgnr,function (error,result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(result));
		}
	});
}

var getDbEnheter = function (req, res) {
	database.getEnheter( function (error,result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(result));
		}
	});
}

var getUserEnheter = function (req, res) {
	var userId = req.session.user.id
	database.getUserEnheter(userId,function (error,result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(result));
		}
	});
}

exports = module.exports = {
	'test':test,
	'getEnhet':getEnhet,
	'addEnhet':addEnhet,
	'getUser':getUser,
	'addUser':addUser,
	'dbenhet': getDbEnhet,
	'dbenheter': getDbEnheter,
	'getUserEnheter':getUserEnheter,
}