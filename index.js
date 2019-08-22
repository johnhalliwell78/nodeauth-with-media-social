var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database');

// Configuration
mongoose.connect(configDB.url);
// require('./config/passport')(passport);
// install express app
// log request to console
app.use(morgan('dev'));
//read cookie (need for authentication)
app.use(cookieParser());
//get information from form
app.use(bodyParser());

//set ejs templating
app.set('view engine', 'ejs');

// set up for passport
app.use(session({secret: 'johnhalliwell0708'}));
app.use(passport.session());
app.use(flash());

// Routes
require('./app/routes')(app, passport);

// launch the server
app.listen(port);
console.log('Running at...' + port);