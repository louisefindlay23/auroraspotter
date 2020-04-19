var express = require('express');
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })

var app = express();

app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function (req, res) {
    res.render('pages/index');
});

// change password page

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
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
    console.log("success");
    console.log(req.file);
    console.log(req.file.filename);
})

app.listen(8080);
