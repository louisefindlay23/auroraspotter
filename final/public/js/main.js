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

}


//function to load aurora status
function loadAurora(){

    //link to aurora watch status
    var mobile_content = '<iframe id ="status-frame" scrolling="no" allowtransparency="true" src="https://aurorawatch.lancs.ac.uk/external/status_text"></iframe>';
    //link to aurora watch status and solar activity plots
    var other_devices = '<div class = "frame-cont"><iframe id="plot-frame" scrolling="no" allowtransparency="true" width="550" height="480" src="https://aurorawatch.lancs.ac.uk/external/rolling_status_text"></iframe></div>';

    //function to load an appriopriate content
    function loadStatus() {
        //on mobile devices display only the aurora watch uk alert status
        if (window.innerWidth < 1280) {
            document.getElementById('aurora_status').innerHTML = mobile_content;
        }
        //on bigger screens display the plots provided by aurora watch uk
        else {
            document.getElementById('aurora_status').innerHTML = other_devices;
        }
    }
    loadStatus();
    //detect change of the screen size and reload the appropriate element
    window.addEventListener('resize', loadStatus);
}


//hash the password on client-side
$(document).ready(function(){
$('#myForm').on('submit', function(){
 var pass = $('#rpassword').val();
var pass_conf = $('#rpassConf').val();
$('#rpassword').val(CryptoJS.MD5(pass).toString());
$('#rpassConf').val(CryptoJS.MD5(pass_conf).toString());
});
    $('#passChange').on('submit', function(){
 var pass = $('#newPwd').val();
var pass_conf = $('#newPwdConf').val();
$('#newPwd').val(CryptoJS.MD5(pass).toString());
$('#newPwdConf').val(CryptoJS.MD5(pass_conf).toString());
});
    
      $('#login-form').on('submit', function(){
 var pass = $('#lpassword').val();
$('#lpassword').val(CryptoJS.MD5(pass).toString());
});
                });



/* Create Profile Page content */

// function profileContent() {
//     //get user's details
//     var usersList = JSON.parse(localStorage.getItem('users'));
//     if (usersList == null) {
//         usersList = [];
//     }
//     var username = JSON.parse(localStorage.getItem('userID'));
//     if (username == null) {
//         username = '';
//     }
//     var user_email = '';

//     //DOM Elements
//     // var username_cont = document.getElementById('profile-user');
//     // var email_cont = document.getElementById('profile-email');
//     var observation_records = JSON.parse(localStorage.getItem('observations'));
//     var new_table = '';
//     var diary_cont = document.getElementById('diary');
//     if (observation_records == null) {
//          observation_records = [];
//      }

//     // var diary_empty = true;

//     //display user's email and username on the screen
//     // for (var i in usersList) {
//     //     if (usersList[i].username == username) {
//     //         user_email = usersList[i].email;
//     //         //display user details on the screen
//     //         username_cont.innerHTML = username;
//     //         email_cont.innerHTML = user_email;
//     //     }
//     // }

//     //create a table with user's observation details on the screen
//     for (var i in observation_records) {
//         if (observation_records[i].username == username) {
//             new_table += '<tr><td>' + observation_records[i].date + '</td><td>' + observation_records[i].time + '</td><td>' + observation_records[i].latitude.toPrecision(5) +
//                 ', ' + observation_records[i].longitude.toPrecision(5) + '</td><td>'+ observation_records[i].observation_photo + '</td></tr>';
//             diary_empty = false;
//         }
//     }

//     //display data on the screen
//     //if no observations saved, display a msg
//     if (diary_empty == true) {
//         diary_cont.insertAdjacentHTML('beforeend', '<p style="margin-top:20%; text-align: center;">Nothing to display here!</p>');
//     }
//     //otherwise display a table with user's observation details
//     else {
//         diary_cont.insertAdjacentHTML('beforeend', ' <table id="diary-tbl"><thead><tr><th>Date</th><th>Time</th><th>Coordinates</th><th>Photo</th></tr></thead><tbody id="table-content">' +
//             new_table + " </tbody></table>");
//     }
// }
