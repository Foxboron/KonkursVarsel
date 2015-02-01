var mysql      = require('mysql');
var async = require('async');
var api = require('./api');
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

var getUsers = function (callback) {
	connection.query('SELECT * FROM brukere', function(err, rows) {
		if(err) {
			callback(err);
		} 
		else {
			callback(null,rows);
		}
});
}

var getUser = function (exId,callback) {
	connection.query('SELECT * FROM brukere WHERE extern_id = ?', exId, function(err, rows) {
		if(err) {
			callback(err);
		} 
		else {
			callback(null,rows);
		}
});
}

var addUser = function (user,callback) {
		getUser(user.extern_id, function (error, result) {
			if(error){
				callback(error)
			}
			else {
				console.log(result);
				if(result.length > 0) {
					callback(null,result[0]);
				}
				else {
				var query = connection.query('INSERT INTO brukere SET ? ',user, function (err, res) {
					if(err){
						callback(err);
					}
					else {
						callback(null,res);
				}		
	});
				}
			}
	});
} 
 
 var addEnhet = function (userId,orgnr,callback) {
 		async.series([
 			// 	getEnhet(orgnr,function (error,result) {
 			// 	if(error){
 			// 	callback(error);
 			// }
 			// else {
 			// 	enhet = result[0]
 			// }
 			// }),
 			api.getEnhet(orgnr,function (err,res) {
 					if(err) {
 						callback(err);
 					}
 					else {
 						var enhet = res.entries[0];
 						var query = connection.query("INSERT INTO bedrifter SET ?", { 
 						orgnr:enhet.orgnr, 
 						navn:enhet.navn, 
 						addresse:enhet.forretningsadr, 
 						postnummer:enhet.forradrpostnr, 
 						avvikling:enhet.avvikling,
 						konkurs:enhet.konkurs, 
 						tvangsavvikling:enhet.tvangsavvikling,
 						sektorkode:enhet.sektorkode,
 						nkode1:enhet.nkode1,
 						tidligerekonk:'N',
 						sistoppdatert:'NULL'
 						}, function (errr) {
						});
 					}
 				}),
 			connection.query('INSERT INTO subs SET ?',{orgnr_id:orgnr,bruker_id:userId}, function(er){							
						}),
 				getEnhet(orgnr,function (error,result) {
 				if(error){
 				callback(error);
 			}
 			else {
 				console.log(result[0]);
 				callback(null,result);
 			}
 			})
 			]);
		
 	}

 var getEnhet = function (orgnr,callback) {
 	 connection.query('SELECT * FROM bedrifter WHERE orgnr = ?', orgnr, function (err,res) {
 	 	if(err){
 	 		callback(err);
 	 	}
 	 	else {
 	 		callback(null,res);
 	 	}
 	 });
 }

 var getEnheter = function (callback) {
 	 connection.query('SELECT * FROM bedrifter', function (err,res) {
 	 	if(err){
 	 		callback(err);
 	 	}
 	 	else {
 	 		callback(null,res);
 	 	}
 	 });
 }

 var getUserEnheter = function(userId,callback) {
 	console.log('userId: ' + userId);
 	connection.query('SELECT * FROM subs s JOIN bedrifter b ON s.orgnr_id = b.orgnr WHERE s.bruker_id = ? ORDER BY b.navn', userId,function (err,res) {
 			if(err){
 	 		callback(err);
 	 	}
 	 	else {
 	 		callback(null,res);
 	 	}
 	 });
 }

exports = module.exports = {
	'getUsers':getUsers,
	'getUser':getUser,
	'addUser':addUser,
	'addEnhet': addEnhet,
	'getEnhet': getEnhet,
	'getEnheter': getEnheter,
	'getUserEnheter':getUserEnheter,
};
