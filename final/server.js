//**************** DATABASE and EXPRESS connections *************************

require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const { MongoClient } = require("mongodb");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const multer = require("multer");
const sharp = require("sharp");

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || "aurora";
const SESSION_SECRET = process.env.SESSION_SECRET || "keyboard cat";
const BCRYPT_ROUNDS = 10;

//******************** DATABASE - connect once on startup ********************

// Single client for the whole process. Do not connect/close per request.
const client = new MongoClient(
    process.env.DB_URL || "mongodb://127.0.0.1:27017"
);
let db;

async function connectDB() {
    await client.connect();
    db = client.db(DB_NAME);
    await db.command({ ping: 1 }); // fail fast if Atlas URI / IP allowlist is wrong
}

//******************** UPLOADS **********************************************

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/img/uploads/aurora");
        },
        filename: function (req, file, cb) {
            let a = Math.floor(Math.random() * 1001);
            cb(null, file.fieldname + "-" + a + path.extname(file.originalname));
        },
    }),
});

//******************** PASSPORT (local strategy) ****************************

passport.use(
    new LocalStrategy(
        { usernameField: "name", passwordField: "password" },
        async (username, password, done) => {
            try {
                const profile = await db
                    .collection("profiles")
                    .findOne({ username });
                // Same message for unknown user and wrong password - do not leak which.
                if (!profile) {
                    return done(null, false, {
                        message:
                            "The username or password you entered are incorrect",
                    });
                }
                const ok = await bcrypt.compare(password, profile.password);
                if (!ok) {
                    return done(null, false, {
                        message:
                            "The username or password you entered are incorrect",
                    });
                }
                return done(null, profile);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser(async (username, done) => {
    try {
        const user = await db
            .collection("profiles")
            .findOne({ username });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

//******************** EXPRESS **********************************************

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Make auth state available to every template (header.ejs uses isLoggedIn)
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.isAuthenticated ? req.isAuthenticated() : false;
    next();
});

// Small helpers
const wrap = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const requireLogin = (req, res, next) =>
    req.isAuthenticated() ? next() : res.redirect("/login");

//******************** VIEW HELPERS *****************************************

// Build the Observation Diary table for the profile page.
function buildObservationsTable(observations) {
    if (!observations || observations.length === 0) {
        return '<p style="margin-top:20%; text-align: center;">You have not recorded any Aurora observations yet!</p>';
    }
    let output =
        '<table id="diary-tbl"><thead> <tr><th>Date</th><th>Time</th><th>Coordinates</th><th>Photo</th></tr></thead><tbody id="table-content">';
    for (const ob of observations) {
        output +=
            "<tr><td>" +
            ob.date +
            "</td><td>" +
            ob.time +
            ", " +
            ob.latitude +
            "</td><td>" +
            ob.longitude +
            '</td><td><img id="aurora_photo" src="../img/uploads/aurora/' +
            ob.observation_photo +
            '"/></td></tr>';
    }
    output += "</tbody></table>";
    return output;
}

//******************** GET ROUTES - display pages ***************************

// root route
app.get(
    "/",
    wrap(async (req, res) => {
        // details of the latest photo uploaded
        const photo = await db
            .collection("photo")
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();
        res.render("pages/index", {
            photo: photo[0] ? photo[0].filename : "aurora-default.jpg",
        });
    })
);

// change password route
app.get("/change-password", requireLogin, function (req, res) {
    res.render("pages/change-password", { changepass_error: "" });
});

// login route
app.get("/login", function (req, res) {
    res.render("pages/login", { login_error: "" });
});

// profile route
app.get("/profile", requireLogin, function (req, res) {
    res.render("pages/profile", {
        profilephoto: req.user.filename,
        username: req.user.username,
        email: req.user.email,
    });
});

// observations data for the profile page
app.get("/getObervationsData", requireLogin, function (req, res) {
    db.collection("observations")
        .find({ username: req.user.username })
        .toArray()
        .then((observations) => res.send(buildObservationsTable(observations)))
        .catch((err) => {
            console.error(err);
            res.status(500).send("Could not load observations");
        });
});

// settings route
app.get("/settings", requireLogin, function (req, res) {
    res.render("pages/settings");
});

// signup route
app.get("/signup", function (req, res) {
    res.render("pages/signup", { signup_error: "" });
});

//******************** POST ROUTES ******************************************

// upload photo + observation
app.post(
    "/upload-aurora",
    requireLogin,
    upload.single("aurora"),
    wrap(async (req, res) => {
        const username = req.user.username;
        let photo_path = "aurora-default.jpg";

        if (req.file) {
            photo_path = req.file.filename;

            // resize image to 235px width, then overwrite the uploaded file
            const buffer = await sharp(req.file.path).resize(235).toBuffer();
            await fs.promises.writeFile(req.file.path, buffer);

            // save image file details in db
            await db.collection("photos").insertOne(req.file);
        }

        // create + save the observation (also when no photo was uploaded)
        await db.collection("observations").insertOne({
            username: username,
            latitude: req.body.lat,
            longitude: req.body.long,
            date: req.body.ob_date,
            time: req.body.ob_time,
            observation_photo: photo_path,
        });

        res.redirect("/");
    })
);

// registration form handler
app.post(
    "/uploadProfile",
    upload.single("profile"),
    wrap(async (req, res) => {
        const name = req.body.username;
        const password = req.body.password;
        const pass_conf = req.body.confirm_password;
        const email = req.body.email;

        if (!name || !password || !email || !pass_conf) {
            return res.render("pages/signup", {
                signup_error: "Please provide all details",
            });
        }

        const existing = await db
            .collection("profiles")
            .findOne({ username: name });
        if (existing) {
            return res.render("pages/signup", {
                signup_error:
                    "The username already registered. Please try a different username",
            });
        }

        if (pass_conf !== password) {
            return res.render("pages/signup", {
                signup_error: "Passwords entered must be identical",
            });
        }

        if (!req.file) {
            return res.render("pages/signup", {
                signup_error: "Please upload profile photo",
            });
        }

        // resize profile photo to 128px width
        const buffer = await sharp(req.file.path).resize(128).toBuffer();
        await fs.promises.writeFile(req.file.path, buffer);

        // hash the password before storing - never store plaintext
        const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

        await db.collection("profiles").insertOne({
            username: name,
            email: email,
            password: hashed,
            filename: req.file.filename,
        });

        res.redirect("/login");
    })
);

// login form handler
app.post("/dologin", function (req, res, next) {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.render("pages/login", {
            login_error: "Please enter your username and password",
        });
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.render("pages/login", {
                login_error:
                    (info && info.message) ||
                    "The username or password you entered are incorrect",
            });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.redirect("/");
        });
    })(req, res, next);
});

// password change handler
app.post(
    "/changePassword",
    requireLogin,
    wrap(async (req, res) => {
        const newPass = req.body.newpassword;
        const newPassConf = req.body.confirmpassword;

        if (!newPass || !newPassConf) {
            return res.render("pages/change-password", {
                changepass_error: "Please enter new password",
            });
        }

        if (newPass !== newPassConf) {
            return res.render("pages/change-password", {
                changepass_error: "Passwords do not match",
            });
        }

        const hashed = await bcrypt.hash(newPass, BCRYPT_ROUNDS);
        await db
            .collection("profiles")
            .updateOne(
                { username: req.user.username },
                { $set: { password: hashed } }
            );

        // log them out so they sign in again with the new password
        req.logout((err) => {
            if (err) return res.redirect("/login");
            res.redirect("/login");
        });
    })
);

// signout handler
app.get("/signout", function (req, res) {
    req.logout(() => res.redirect("/"));
});

//******************** JSON ROUTES ******************************************

// all observations, for the map
app.get(
    "/getObservations",
    wrap(async (req, res) => {
        const observations = await db
            .collection("observations")
            .find({})
            .toArray();
        res.send(observations);
    })
);

// is the user logged in?
app.get("/getIsLogged", function (req, res) {
    res.send(req.isAuthenticated());
});

//******************** ERROR HANDLING ***************************************

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something went wrong");
});

//******************** STARTUP **********************************************

async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => console.log("Listening on " + PORT));
    } catch (err) {
        console.error("Failed to start:", err);
        process.exit(1);
    }
}

if (require.main === module) {
    start();
}

module.exports = { app, buildObservationsTable };
