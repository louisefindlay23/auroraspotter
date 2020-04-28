
//**************** DATABASE and EXPRESS connections *************************

// Database Connections

const MongoClient = require('mongodb').MongoClient; 
const url = "mongodb://localhost:27017/usersdb";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');

// Node Modules

var multer = require('multer');
var path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Multer DiskStorage - for storing images

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/uploads/aurora');
  },
  filename: function (req, file, cb) {
    let a = Math.floor(Math.random() * 1001);
    cb(null, file.fieldname + '-' + a + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

// Initalising Express

app.use(express.static('public'));
app.use(session({secret: 
    'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

var db;

// connecting variable db to database
MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database;
    app.listen(8080);
    console.log('Listening on 8080');
});


//******************** GET ROUTES - display pages **************************

// root route
app.get('/', function (req, res) {

// get the details of the latest photo uploaded
db.collection('photo').find({}).sort({'_id':-1}).limit(1).toArray(function (err, result) {
    console.log(result);
    // get the filename of the latest photo uploaded
    var arrayphoto = result[0].filename;
    console.log(arrayphoto);
    // render the index page and pass the filename of the latest photo uploaded as a variable
    res.render("pages/index",{photo: arrayphoto});
    });
});

// change password route
app.get('/change-password', function (req, res) {
    res.render('pages/change-password');
});

// login route
app.get('/login', function (req, res) {
    res.render('pages/login');
});

// profile route
app.get('/profile', function (req, res) {
    //if(!req.session.logged){res.redirect('/login');return;}
    // get requested user by the username
    db.collection('profiles').find({}).sort({'_id':-1}).limit(1).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result[0].username);
        var username = result[0].username;
        var email = result[0].email;
      
        // get the details of the latest photo uploaded
        db.collection('profile-photo').find({}).sort({'_id':-1}).limit(1).toArray(function (err, photo) {
        console.log(photo);
        // get the filename of the latest photo uploaded
        var arrayphoto = photo[0].filename;
        console.log(arrayphoto);
        // render the index page and pass the filename of the latest photo uploaded as a variable
        res.render('pages/profile', {
            user: result,
            profilephoto: arrayphoto,
            username: username,
            email: email
    });
});
});
});

// settings route
app.get('/settings', function (req, res) {
    res.render('pages/settings');
});

// change password route

app.get('/signup', function (req, res) {
    res.render('pages/signup');
});

// upload photo routes

app.post('/upload-aurora', upload.single('aurora'), function (req, res, next) {
  // req.file is the `photo` file
    console.log("Aurora photo has been uploaded");
    console.log(req.file);
    console.log(req.file.filename);
    var photofile = req.file;

    // resize image to 235px width
    sharp(req.file.path)
                    .resize(235)
                    .toBuffer(function(err, buffer) {
        if (err) throw err;
        fs.writeFile(req.file.path, buffer, function(e) {
        });
    });

    // save image file details in db
    db.collection('photo').save(photofile, function(err, result) {
    if (err) throw err;
    console.log('Aurora photo saved to database');
    });

    res.redirect("/");
});

app.post('/upload-profile', upload.single('profile'), function (req, res, next) {
  // req.file is the `photo` file
    console.log("Profile photo has been uploaded");
    console.log(req.file);
    console.log(req.file.filename);
    var photofile = req.file;

    // resize image to 128px width
    sharp(req.file.path)
                    .resize(128)
                    .toBuffer(function(err, buffer) {
        if (err) throw err;
        fs.writeFile(req.file.path, buffer, function(e) {
        });
    });

    // save image file details in db
    db.collection('profile-photo').save(photofile, function(err, result) {
    if (err) throw err;
    console.log('Profile photo saved to the database');
    res.redirect("/");
    });
});
