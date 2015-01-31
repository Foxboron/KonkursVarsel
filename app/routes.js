var api = require('../app/api');
var database = require('../app/database');
var mock = require('../app/mock');

var test = function (req, res) {
    res.send("test");
}


var enhet = function(req, res) {
	var enhet = req.params.enhet;
	api.getEnhet(enhet,function (error,result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(result));
		}
	});
};

var user = function (req, res) {
	database.getUser(function(error,result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(result));
		}
	});
};

var addUser = function (req, res) {
	var user = mock.user;
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


exports = module.exports = {
	'test':test,
	'enhet':enhet,
	'user':user,
	'addUser':addUser,
}