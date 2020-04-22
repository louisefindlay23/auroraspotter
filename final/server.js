
//**************** DATABASE and EXPRESS connections *************************

const MongoClient = require('mongodb').MongoClient; 
const url = "mongodb://localhost:27017/usersdb";
const express = require('express');     // load express
const bodyParser = require('body-parser');
const app = express();                  // access express functions
const session = require('express-session');
// Node Modules

var multer = require('multer');
var path = require('path');

// Multer DiskStorage - for storing images

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })

// Initalising Express

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

var photo = null;

    res.render('pages/index', {
        photo: photo
    });
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

// upload photo route

app.post('/upload', upload.single('photo'), function (req, res, next) {
  // req.file is the `photo` file
    console.log("success");
    console.log(req.file);
    console.log(req.file.filename);
    var photo = req.file.filename;

    res.render('pages/index', {
        photo: photo
    });
})

// app.listen(8080);
