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
}


/* SIGN UP */

//function triggered when user clicks the sign up button
//handles the form validation
//temporarily saves the data in the browser's local storage to simulate the user interaction before back-end implemented

function signUp() {
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
    var observation_records = JSON.parse(localStorage.getItem('observations'));
    var new_table = '';
    var diary_cont = document.getElementById('diary');
    if (observation_records == null) {
         observation_records = [];
     }

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
