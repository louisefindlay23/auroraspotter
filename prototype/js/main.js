$(document).ready(function () {

    $(".fa-bars").click(function () {
        $("header .icon").hide();
        $("main h2").hide();
        $("#menu").show();
    });

    $(".fa-times").click(function () {
        $("#menu").hide();
        $("main h2").addClass("remove-animation");
        $("main h2").show();
        $("header .icon").show();
    });

    $('table tr').each(function () {
        $(this).find('th').first().addClass('first');
        $(this).find('th').last().addClass('last');
        $(this).find('td').first().addClass('first');
        $(this).find('td').last().addClass('last');
    });

});

//function triggered when user clicks the sign up button
//handles form validation
//temporarily saves the data in the browser's local storage to simulate the user interaction before back-end implemented
function signUp() {

    //variables to store users input
    var username = document.getElementById('rusername').value;
    var email = document.getElementById('remail').value;
    var password = document.getElementById('rpassword').value;
    var pwdConf = document.getElementById('rpassConf').value;

    //users list
    var usersList = [];

    //(temporary solution to simulate the user interaction; will be changed during backend implementation due to the security issues)
    //can cause compatibility issues
    var usersSaved = JSON.parse(localStorage.getItem('users'));

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
        error_holder.style.marginTop = '-50px';
        error_holder.innerHTML = 'Please provide all details';
    } else if (pwdConf != password) {
        //TODO: create DOM element to display error msg
        alert("Passwords entered must be identical");
    } else {
        console.log('test');
        //check does the username already exist
        if (usersSaved != null) {
            try {
                for (var i in usersSaved) {
                    if (usersSaved[i].username == username) {
                        userExist = true;
                        //alert for now TODO: create a dom element to display error msg
                        alert('The username already registered. Please try a different username');
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
            usersList = usersSaved;
            let new_user = new User(username, email, password);
            usersList.push(new_user);
            localStorage.removeItem('users');
            localStorage.setItem('users', JSON.stringify(usersList));
            window.location.href = "login.html";

            

        }

    }

}

//login function
function login() {
    //store form user input in variables
    var login = document.getElementById('lusername').value;
    var password = document.getElementById('lpassword').value;
    var usersSaved = JSON.parse(localStorage.getItem('users'));
    var logged = false;

    //check that the login and password fields have been filled up
    if (login == '' || password == '') {
        //TODO: style error msg
        alert('Details incorrect');
    } else {
        //check does the username exist in the users list
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
            window.location.href = "index.html";
        } else {
            alert('Details incorrect');
        }
    }


}

//function to change user's password
function changePassword(){
    //set user input to variables
    var newPwd = document.getElementById('newPwd').value;
    var newPwdConf = document.getElementById('newPwdConf').value;
    
    //get username
    var login = JSON.parse(localStorage.getItem('userID'));

    //get the list of the users
    var usersSaved = JSON.parse(localStorage.getItem('users'));
    
    //check the passwords are the same
    if(newPwd != newPwdConf || newPwd==''){
        //TODO: style error msg
        console.log(newPwd);
        console.log(newPwdConf);
        alert('Passwords entered must be identical');
    }
    //update user's password
    else{
        for (var i in usersSaved) {
            if (usersSaved[i].username == login) {
                usersSaved[i].password = newPwd;
                localStorage.removeItem('users');
                localStorage.setItem('users', JSON.stringify(usersSaved));
                setTimeout(function(){document.location.href = "settings.html"},500);
            }
    }

            
}
}

//signout function
//change the localStorage logged value to false
//redirect the user to the index page
function signout() {
    localStorage.setItem('logged', JSON.stringify(false));
    localStorage.setItem('userID', JSON.stringify('null'));
    window.location.href = "index.html";

}

// function to hide menu elements
function hideElements() {
    // check if user is logged in
    var isLogged = JSON.parse(localStorage.getItem('logged'));
     //var isLogged = false;
    if(!isLogged){
        $(".logout-nav").hide();        // if not logged in, hide Profile and Setting from nav
        
    }
    else{
        $(".login-nav").hide();        // if logged in, hide Login and Sign up from nav
    }

}
