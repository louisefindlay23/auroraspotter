
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
app.use(session({
    secret:
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
MongoClient.connect(url, function (err, database) {
    if (err) throw err;
    db = database;
    app.listen(8080);
    console.log('Listening on 8080');
});

// set default session.loggedin value
session.loggedin = false;



//******************** GET ROUTES - display pages **************************

// root route
app.get('/', function (req, res) {
    var isLogged = req.session.loggedin;
    // get the details of the latest photo uploaded
    db.collection('photo').find({}).sort({ '_id': -1 }).limit(1).toArray(function (err, result) {
        console.log("Uploaded aurora photo details" + result);
        // get the filename of the latest photo uploaded
        var arrayphoto = result[0].filename;
        console.log("From db - aurora photo details" + arrayphoto);
        //render the index page and pass the filename of the latest photo uploaded as a variable
        res.render("pages/index", { photo: arrayphoto, isLoggedIn: isLogged });
    });
});

// change password route
app.get('/change-password', function (req, res) {
    //if user is not logged in, redirect them to the login page
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    var isLogged = req.session.loggedin;
    var msg = '';
    res.render('pages/change-password', { changepass_error: msg, isLoggedIn: isLogged });
});


// login route
app.get('/login', function (req, res) {
    var msg = '';
    var isLogged = req.session.loggedin;
    res.render('pages/login', {
        login_error: msg,
        isLoggedIn: isLogged
    });
});

// profile route
app.get('/profile', function (req, res) {
    //if user is not logged in, redirect them to the login page
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    //Login status
    var isLogged = req.session.loggedin;
    var loggedUser = req.session.username;

    // get observations for the username
    db.collection('observations').find({ username: loggedUser }).toArray(function (err, observation) {

        //get observation details
        var date = observation[0].date;
        var time = observation[0].time;
        var longitude = observation[0].longitude;
        var latitude = observation[0].latitude;
        var auroraphoto = observation[0].observation_photo;

        var observation_records = [];
        observation_records.push(date, time, longitude, latitude, auroraphoto);

        // get requested user by the username
        db.collection('profiles').find({ username: loggedUser }).toArray(function (err, user) {
            console.log("User details" + user);
            // get user's details
            var username = user[0].username;
            var email = user[0].email;
            var arrayphoto = user[0].filename;
            console.log("Profile Pic is" + arrayphoto);
            console.log("Username is" + username);
            console.log("Email is" + email);

            // render the profile page and pass the filename of the latest photo uploaded as a variable
            res.render('pages/profile', {
                profilephoto: arrayphoto,
                username: username,
                email: email,
                isLoggedIn: isLogged,
                observation_records: observation
            });
        });
    });
});


// settings route
app.get('/settings', function (req, res) {
    //if user is not logged in, redirect them to the login page
    if (!req.session.loggedin) { res.redirect('/login'); return; }

    var isLogged = req.session.loggedin;
    res.render('pages/settings', { isLoggedIn: isLogged });
});


// signup route

app.get('/signup', function (req, res) {
    var msg = '';
    var isLogged = req.session.loggedin;
    res.render('pages/signup', { signup_error: msg, isLoggedIn: isLogged });
});


// upload photo routes

app.post('/upload-aurora', upload.single('aurora'), function (req, res, next) {
    //Think a if req.file = “” redirect to / and set vars as # should do it
    // req.file is the `photo` file
    // console.log("Uploaded aurora photo details" + req.file);
    //  console.log("Upload aurora photo filename" + req.file.filename);
    var photofile = req.file;

    // resize image to 235px width
    sharp(req.file.path)
        .resize(235)
        .toBuffer(function (err, buffer) {
            if (err) throw err;
            fs.writeFile(req.file.path, buffer, function (e) {
            });
        });

    // save image file details in db
    db.collection('photo').save(photofile, function (err, result) {
        if (err) throw err;
        console.log('Aurora photo saved to database');
    });

    //get observation details (location, date/time, username)
    var username = req.session.username;
    var long = req.body.long;
    var lat = req.body.lat;
    var ob_date = req.body.ob_date;
    var ob_time = req.body.ob_time;
    var photo_path = req.file.filename;

    //create new observation 
    var newObservation = { "username": username, "latitude": lat, "longitude": long, "date": ob_date, "time": ob_time, "observation_photo": photo_path };

    //save observation in database 
    db.collection('observations').save(newObservation, function (err, result) {
        if (err) throw err;
    });
    res.redirect("/");

});


//registration form handler
app.post('/uploadProfile', upload.single('profile'), function (req, res, next) {

    //get user details
    var name = req.body.username;
    var password = req.body.password;
    var pass_conf = req.body.confirm_password;
    var email = req.body.email;
    var error_msg = '';
    var isLogged = req.session.loggedin;

    //if any of input fields empty, display an error msg
    //d41d8cd98f00b204e9800998ecf8427e is an MD5 hash of empty string
    if (name == '' || password == '' || email == '' || pass_conf == '' || pass_conf == 'd41d8cd98f00b204e9800998ecf8427e' || password == 'd41d8cd98f00b204e9800998ecf8427e') {
        error_msg = 'Please provide all details';
        res.render('pages/signup', {
            signup_error: error_msg,
            isLoggedIn: isLogged
        }); return;

        //query the database for the user's details
    } else {
        db.collection('profiles').findOne({ 'username': name }, function (err, result) {
            if (err) throw err;

            //username must be unique so if in database, display an error msg
            if (result) {
                error_msg = 'The username already registered. Please try a different username';
                res.render('pages/signup', {
                    signup_error: error_msg,
                    isLoggedIn: isLogged
                }); return;
            }

            //if password and password confirmation dont match, display an error msg
            else if (pass_conf != password) {
                error_msg = 'Passwords entered must be identical';
                res.render('pages/signup', {
                    signup_error: error_msg,
                    isLoggedIn: isLogged
                }); return;
            }

            //if all information correct, upload the profile photo to the server and save user's data in profiles collection
            else {
                //save the photo
                // req.file is the `photo` file
                var photofile = req.file;

                if (photofile == null) {
                    error_msg = 'Please upload profile photo';
                    res.render('pages/signup', {
                        signup_error: error_msg,
                        isLoggedIn: isLogged
                    }); return;
                }

                else {
                    // resize image to 128px width
                    sharp(req.file.path)
                        .resize(128)
                        .toBuffer(function (err, buffer) {
                            if (err) throw err;
                            fs.writeFile(req.file.path, buffer, function (e) {
                            });
                        });
                    //create new user and insert into database
                    console.log("Upload Profile Photo filename" + req.file.filename);
                    var user_details = { "username": name, "email": email, "password": password, "filename": req.file.filename };
                    db.collection('profiles').save(user_details, function (err, result) {
                        if (err) throw err;
                        res.redirect('/login');
                    });

                }
            }
        });
    }
});


//login form handler
app.post('/dologin', function (req, res) {

    //get user's input
    var name = req.body.name;
    var password = req.body.password;
    var error_msg = '';
    var isLogged = req.session.loggedin;

    //check is any of the input fields empty, if so, display an error msg
    //d41d8cd98f00b204e9800998ecf8427e is MD5hash for empty string
    if (name == '' || password == '' || password == 'd41d8cd98f00b204e9800998ecf8427e') {
        error_msg = 'Please enter your username and password';
        res.render('pages/login', {
            login_error: error_msg,
            isLoggedIn: isLogged
        }); return;
    }

    //query the db, get users information
    db.collection('profiles').findOne({ 'username': name }, function (err, result) {
        if (err) throw err;

        //if username not in database display an error msg
        if (!result) {
            error_msg = 'The username or password you entered are incorrect';
            res.render('pages/login', {
                login_error: error_msg,
                isLoggedIn: isLogged
            }); return;
        }

        //if the password entered matched user's password in the database change session.loggedin value to true and redirect the user to index page
        if (result.password == password) {
            req.session.loggedin = true;
            req.session.username = result.username;
            res.redirect('/');

            //if passwords dont match display an error msg
        } else {
            error_msg = 'The username or password you entered are incorrect';
            res.render('pages/login', {
                login_error: error_msg,
                isLoggedIn: isLogged
            }); return;
        }
    });
});


//password change handler
app.post('/changePassword', function (req, res) {

    //get user's input
    var newPass = req.body.newpassword;
    var newPassConf = req.body.confirmpassword;
    var isLogged = req.session.loggedin;
    var error_msg = '';

    //check is password or password confirmation empty; if it is throw error msg
    //d41d8cd98f00b204e9800998ecf8427e is MD5 hash for empty string
    if (newPass == '' || newPassConf == '' || newPass == 'd41d8cd98f00b204e9800998ecf8427e' || newPassConf == 'd41d8cd98f00b204e9800998ecf8427e') {
        console.log('fields missing');
        error_msg = 'Please enter new password';
        res.render('pages/change-password', {
            changepass_error: error_msg,
            isLoggedIn: isLogged
        }); return;
    }

    //display an error msg if passwords entered dont match
    else if (newPass != newPassConf) {
        console.log('passwords different');
        error_msg = 'Passwords do not match';
        res.render('pages/change-password', {
            changepass_error: error_msg,
            isLoggedIn: isLogged
        }); return;
    }


    //if passwords correct update user's data in database, log them out and redirect to login page, so they can sign in with new password
    else {
        var user = req.session.username;
        db.collection('profiles').updateOne(({ "username": user }), ({ $set: { "password": newPass } }), function (err, result) {
            if (err) throw err;
            req.session.loggedin = false;
            res.redirect('/login');
        });
    }
});


//signout handler
app.get('/signout', function (req, res) {
    req.session.loggedin = false;
    var isLogged = req.session.loggedin;
    req.session.username = null;
    res.redirect('/');
});


//retrive observations data from database and return them to browser
app.get('/getObservations', function (req, res) {
    db.collection('observations').find().toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});


//send information is the user logged in to the browser
app.get('/getIsLogged', function (req, res) {
    var isLogged = false;
    if (req.session.loggedin == true) {
        isLogged = true;
    }
    res.send(isLogged);
});
