var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + 'public'});
var app = express();

app.use(express.static('../public/img/uploads'));

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

app.post('/upload', upload.single('photo'), (req, res, next) => {
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
});

app.listen(8080);
