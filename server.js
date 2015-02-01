//Setup
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('./app/routes');
var config = require('./app/config');
var database = require('./app/database');
var passport = require('passport');
var session = require('express-session');
var GitHubStrategy = require('passport-github').Strategy;
var MemoryStore = session.MemoryStore;
//app.use(express.static(__dirname + '/public'));

//app.use(morgan('dev'));

//app.use(bodyParser.urlencoded({'extended':'true'}));

//app.use(bodyParser.json());

//app.use(bodyParser.json({ type: 'application/vnd.api+json'}));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.use(cookieParser('cookie_secret'));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());


passport.use(new GitHubStrategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: config.callback + "/auth/github/callback"
    //callbackURL: "http://localhost:8080/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      //console.log(profile);
      			var user = {
      				navn: profile._json.name,
      				extern_id: 'github:' + profile.id,
      				email: profile._json.email
      			}
      			console.log(user);
      			database.addUser(user,function(error){
      				if(error){
      					console.log(error);
      				}
      		});
      return done(null, profile);
    });
  }
));



app.get('/login', function(req, res){
  res.send('<a href="/auth/github">Login with GitHub</a>');
});

app.get('/logout', function(req,res){
	req.session.destroy(function(err){

	})
	req.logout();
	res.redirect('/');
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', {failureRedirect: '/login' }), function (req,res) {
  	res.redirect('/#/list');
  });

app.get('/auth/github',
  passport.authenticate('github', { scope: 'read_stream' })
);

app.get('/api/enhet/:orgnr',ensureAuthenticated, routes.getEnhet);

app.get('/api/me', ensureAuthenticated,routes.getUser);
//app.get('/api/user',routes.user);

//app.get('/api/dbenhet', routes.dbenheter);
app.get('/api/dbenhet/:orgnr',ensureAuthenticated, routes.dbenhet);

//app.post('/api/me',routes.addUser);
app.get('/api/org/:orgnr',ensureAuthenticated,routes.addEnhet);
app.get('/api/org',ensureAuthenticated,routes.getUserEnheter);

app.listen(8080);
console.log("App listening to port 8080");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  }
  res.send({error:'Not logged in.'});
  //res.redirect('/login')
}
