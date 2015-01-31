var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '188.166.48.220',
  user     : 'konkurs',
  password : 'abcdef1234',
  database: 'konkurs'
});

connection.connect(function(err) {
   if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

var getUser = function (callback) {
	connection.query('SELECT * FROM brukere', function(err, rows) {
		if(err) {
			callback(err);
		} 
		else {
			callback(null,rows);
		}
});
}

var addUser = function (user,callback) {
	var query = connection.query('INSERT INTO brukere SET ?',user, function (err, res) {
		if(err){
			callback(err);
		}
		else {
			console.log(query.sql)
			callback(null,res);
		}
	});
}

exports = module.exports = {
	'getUser':getUser,
	'addUser':addUser,
};
