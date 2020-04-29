//Project: Aurora
//Group: DM Web Dev Team
//TMs: Maya Bonazarovaarova, Louise Findlay, Miriam Wojcik, Brandon Reid
//Date: 2/3/2020
//Main JS


/* DOM Manipulation */

// Function called on page load to manage the nav bar
$(document).ready(function () {

    // Hide div with image that stores uploaded photo variable
    $("#ejs-variable").hide();

    // Show/Hide different navs and icons for hamburger menu
    $(".fa-bars").click(function () {
        $("#menu").show();
    });

    $(".fa-times").click(function () {
        $("#menu").hide();
    });

    // Table Styling
    $('table tr').each(function () {
        $(this).find('th').first().addClass('first');
        $(this).find('th').last().addClass('last');
        $(this).find('td').first().addClass('first');
        $(this).find('td').last().addClass('last');
    });

    $(".leaflet-popup-content img").attr('id', 'uploadedphoto');

    // Change input file text to name of file
    $('#upload-aurora').change(function() {
         $("#upload-aurora-label").text(this.files[0].name);
});
    $('#upload-profile').change(function() {
         $("#upload-profile-label").text(this.files[0].name);
});

});

// function to hide menu elements
function hideElements() {
    // check if user is logged in
    var isLogged = JSON.parse(localStorage.getItem('logged'));
    //var isLogged = false;
    if (!isLogged) {
        $(".logout-nav").hide(); // if not logged in, hide Profile and Setting from nav

    } else {
        $(".login-nav").hide(); // if logged in, hide Login and Sign up from nav
    }

}


/* SIGN UP */

//function triggered when user clicks the sign up button
//handles the form validation
//temporarily saves the data in the browser's local storage to simulate the user interaction before back-end implemented

function signUp() {

    //get users input
    var username = document.getElementById('rusername').value;
    var email = document.getElementById('remail').value;
    var password = document.getElementById('rpassword').value;
    var pwdConf = document.getElementById('rpassConf').value;

    //array to hold list of all users
    var usersList = [];

    //read the list of users registered and put them in an array
    //(temporary solution to simulate the user interaction; will be changed during backend implementation due to the security issues)
    //can cause compatibility issues
    var usersSaved = JSON.parse(localStorage.getItem('users'));
    if (usersSaved == null) {
        usersSaved = [];
    }

    //boolean to keep track is user in the list
    var userExist = false;

    //DOM element to display an error msg
    var error_holder = document.getElementById('error-msg');

    //create user class
    class User {
        constructor(username, email, password) {
            this.username = username;
            this.email = email;
            this.password = password;
        }

        //method to change user's password
        changePwd(newPwd) {
            this.password = newPwd;
        }
    }


    //prevent page refreshing on button click
    var form = document.getElementById("myForm");

    function handleForm(event) {
        event.preventDefault();
    }
    form.addEventListener('submit', handleForm);


    //check all input fields have been filled up, if not display an error msg
    if (username == '' || email == '' || pwdConf == '' || password == '') {
        error_holder.innerHTML = 'Please provide all details';
    } else if (pwdConf != password) {
        //display error msg if passwords entered dont match
        error_holder.innerHTML = 'Passwords entered must be identical';
    } else {
        //check does the username already exist
        if (usersSaved != null) {
            try {
                for (var i in usersSaved) {
                    if (usersSaved[i].username == username) {
                        userExist = true;
                        //display an error msg if the username already registered
                        error_holder.innerHTML = 'The username already registered<br/>Please try a different username';
                    }
                }
            } catch (err) {
                console.log('no users saved');
            }
        } else {
            console.log('no users saved');
        }

        //if user not in the list, validate the rest of the form
        //if input correct, add to the list of users and save in Local Storage
        if (!userExist) {
            //encrypt user's password using MD5 (still better than plain text)
            password = CryptoJS.MD5(password).toString();
            usersList = usersSaved;
            let new_user = new User(username, email, password);
            usersList.push(new_user);
            localStorage.removeItem('users');
            localStorage.setItem('users', JSON.stringify(usersList));
            window.location.href = "/login";
        }

    }
}


/* LOG IN */

//login function called when user submits the form on login page
function login() {

    //get user's input
    var login = document.getElementById('lusername').value;
    var password = document.getElementById('lpassword').value;
    var usersSaved = JSON.parse(localStorage.getItem('users'));
    var logged = false;
    var error_holder = document.getElementById('login-error');

    //prevent page refreshing on button click
    var form = document.getElementById("login-form");

    function handleForm(event) {
        event.preventDefault();
    }
    form.addEventListener('submit', handleForm);

    //check that the login and password fields have been filled up
    if (login == '' || password == '') {
        //display error msg if any of the fields not filled up
        error_holder.innerHTML = 'Please enter your username and password';
    } else {
        //check does the username exist in the users list
        password = CryptoJS.MD5(password).toString();
        try {
            for (var i in usersSaved) {
                if (usersSaved[i].username == login) {
                    //if it does, check does the password match
                    if (usersSaved[i].password == password) {
                        //if it does set the logged value to true
                        logged = true;
                        //set the index of the logged user
                        localStorage.setItem('userID', JSON.stringify(login));
                    }
                }

            }
        } catch (err) {
            console.log('no users saved');
        }

        //if the logged value is true, redirect user to home page
        //otherwise display an error msg
        if (logged == true) {
            localStorage.setItem('logged', JSON.stringify(true));
            var form = document.getElementById("login-form");

            function handleForm(event) {
                event.preventDefault();
            }
            form.addEventListener('submit', handleForm);
            window.location.href = "/";
        } else {
            //display error msg
            error_holder.innerHTML = 'Details incorrect';
        }
    }
}

/* PASSWORD CHANGE */

//function called when user submits the form on the PasswordChange page
function changePassword() {

    //get user's input
    var newPwd = document.getElementById('newPwd').value;
    var newPwdConf = document.getElementById('newPwdConf').value;

    //get username of the person logged in from the local storage
    var login = JSON.parse(localStorage.getItem('userID'));

    //get the list of the users
    var usersSaved = JSON.parse(localStorage.getItem('users'));

    //DOM Element to display error msges
    var error_holder = document.getElementById('passchange-error');

    //prevent page refreshing on button click
    var form = document.getElementById("passChange");

    function handleForm(event) {
        event.preventDefault();
    }
    form.addEventListener('submit', handleForm);

    //check new password field is not empty
    if (newPwd == '') {
        //display error msg if passwords dont match
        error_holder.innerHTML = 'Enter new password below';
    }

    //check the passwords are the same
    else if (newPwd != newPwdConf) {
        error_holder.innerHTML = 'Passwords entered must be identical';
    }

    //update user's password; save encrypted in the local storage (temporary solution)
    else {
        var pass_hash = CryptoJS.MD5(newPwd).toString();
        for (var i in usersSaved) {
            if (usersSaved[i].username == login) {
                usersSaved[i].password = pass_hash;
                localStorage.removeItem('users');
                localStorage.setItem('users', JSON.stringify(usersSaved));
                setTimeout(function () {
                    document.location.href = "settings.html"
                }, 500);
            }
        }

    }
}


/* SIGN OUT */

//function called when user clicks Log Out btn
function signout() {

    //change the localStorage logged value to false
    localStorage.setItem('logged', JSON.stringify(false));
    localStorage.setItem('userID', JSON.stringify('null'));
    //redirect the user to the index page
    window.location.href = "/";
}


/* Create Profile Page content */

function profileContent() {
    //get user's details
    var usersList = JSON.parse(localStorage.getItem('users'));
    if (usersList == null) {
        usersList = [];
    }
    var username = JSON.parse(localStorage.getItem('userID'));
    if (username == null) {
        username = '';
    }
    var user_email = '';

    //DOM Elements
    // var username_cont = document.getElementById('profile-user');
    // var email_cont = document.getElementById('profile-email');
    // var observation_records = JSON.parse(localStorage.getItem('observations'));
    // var new_table = '';
    // var diary_cont = document.getElementById('diary');
    // if (observation_records == null) {
    //     observation_records = [];
    // }

    // var diary_empty = true;

    //display user's email and username on the screen
    // for (var i in usersList) {
    //     if (usersList[i].username == username) {
    //         user_email = usersList[i].email;
    //         //display user details on the screen
    //         username_cont.innerHTML = username;
    //         email_cont.innerHTML = user_email;
    //     }
    // }

    //create a table with user's observation details on the screen
    for (var i in observation_records) {
        if (observation_records[i].username == username) {
            new_table += '<tr><td>' + observation_records[i].date + '</td><td>' + observation_records[i].time + '</td><td>' + observation_records[i].latitude.toPrecision(5) +
                ', ' + observation_records[i].longitude.toPrecision(5) + '</td><td>'+ observation_records[i].observation_photo + '</td></tr>';
            diary_empty = false;
        }
    }

    //display data on the screen
    //if no observations saved, display a msg
    if (diary_empty == true) {
        diary_cont.insertAdjacentHTML('beforeend', '<p style="margin-top:20%; text-align: center;">Nothing to display here!</p>');
    }
    //otherwise display a table with user's observation details
    else {
        diary_cont.insertAdjacentHTML('beforeend', ' <table id="diary-tbl"><thead><tr><th>Date</th><th>Time</th><th>Coordinates</th><th>Photo</th></tr></thead><tbody id="table-content">' +
            new_table + " </tbody></table>");
    }
}
