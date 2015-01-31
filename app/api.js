var http = require('http');
	url = 'http://hotell.difi.no/api/json/brreg/enhetsregisteret?orgnr=';

var getEnhet = function (query,callback) {
	var data ='',
		json;

	var options = {
		host: 'http://hotell.difi.no',
		path:'/api/json/brreg/enhetsregisteret?'
	};

    request = http.get(url + query, function (response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			data += chunk;
		});
		response.on('end', function () {
			var json = JSON.parse(data);
			callback(null, json);
		});
	});
	request.on('error', function (e) {
		callback(e);
		console.log(e.message);
	});
};

exports = module.exports = {
	'getEnhet':getEnhet,
};