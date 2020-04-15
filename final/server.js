
//**************** DATABASE and EXPRESS connections *************************

const MongoClient = require('mongodb').MongoClient; 
const url = "mongodb://localhost:27017/usersdb";
const express = require('express');     // load express
const bodyParser = require('body-parser');
const app = express();                  // access express functions
const session = require('express-session');

app.use(express.static('public'));

app.use(session({secret: 'keyboard cat'}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());  
app.set('view engine', 'ejs');      // set the view engine to ejs

var db;

// connecting variable db to database
MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database;
    app.listen(8080);
    console.log('Listening on 8080');
});


//******************** GET ROUTES - display pages **************************

// using res.rnder to load up an ejs view files

// root route
app.get('/', function (req, res) {
    res.render('pages/index');
});

// change password page route
app.get('/change-password', function (req, res) {
    res.render('pages/change-password');
});

// login page

app.get('/login', function (req, res) {
    res.render('pages/login');
});

// profile page

app.get('/profile', function (req, res) {
    res.render('pages/profile');
});

// settings page

app.get('/settings', function (req, res) {
    res.render('pages/settings');
});

// change password page

app.get('/signup', function (req, res) {
    res.render('pages/signup');
});

//app.listen(8080);


//********** POST ROUTES - processing data from forms ***************************