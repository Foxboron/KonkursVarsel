//Setup
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./app/routes');

//app.use(express.static(__dirname + '/public'));

//app.use(morgan('dev'));

//app.use(bodyParser.urlencoded({'extended':'true'}));

//app.use(bodyParser.json());

//app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

//require('./app/routes.js')(app);


app.listen(8080);
console.log("App listening to port 8080");

app.get('/', routes.test);
app.get('/api/enhet/:enhet', routes.enhet);
app.get('/api/user',routes.user);

app.post('/api/user',routes.addUser);