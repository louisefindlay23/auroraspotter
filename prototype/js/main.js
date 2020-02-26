$(document).ready(function () {

    $(".fa-bars").click(function () {
        $("header .icon").hide();
                $("main h2").hide();
        $("#menu").show();
    });

    $(".fa-times").click(function () {
        $("#menu").hide();
                $("main h2").addClass("remove-animation");
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
function signUp(){
    
    //variables to store users input
    var username = document.getElementById('rusername').value;
    var email = document.getElementById('remail').value;
    var password = document.getElementById('rpassword').value;
    var pwdConf = document.getElementById('rpassConf').value;
    
    //create user class
    class User{
        constructor(username, email, password){
            this.username = username;
            this.email = email;
            this.password = password;
        }

        changePwd(newPwd){
            this.password = newPwd;
        }
    }

    //users list
    var usersList = [];

    //get the usernames stored in the localStorage 
    //TODO:
    //(temporary solution to simulate the user interaction; will be changed during backend implementation due to the security issues)
    //can cause compatibility issues
    var usersSaved = JSON.parse(localStorage.getItem('users'));

    //boolean to keep track is user in the list
    var userExist = false;

    //check all input fields have been filled up
    if(username == '' || email == '' || pwdConf == '' || password == ''){
        //TODO: create DOM element to display an error msg
        alert('Please provide all details');
    }
    else if(pwdConf != password){
        //TODO: create DOM element to display error msg
        alert("Passwords entered must be identical");
    }
    else{
        console.log('test');
         //check does the username already exist
        if(usersSaved != null){
        try{
            for(var i in usersSaved){
                if(usersSaved[i].username == username){
                    userExist = true;
                    //alert for now TODO: create a dom element to display error msg
                    alert('The username already registered. Please try a different username');
                }
            }  
        } catch(err){
            console.log('no users saved');
        }
    }
    else{
        console.log('no users saved');
    }

        

        //if user not in the list, validate the rest of the form
        //if input correct, add to the list of users and save in Local Storage
        if(!userExist){
            usersList = usersSaved;
            let new_user = new User(username, email, password);
            usersList.push(new_user);
            localStorage.removeItem('users');
            localStorage.setItem('users', JSON.stringify(usersList));
            window.location.href = "login.html";
            
        var form = document.getElementById("myForm");
        function handleForm(event) { event.preventDefault(); } 
        form.addEventListener('submit', handleForm);
   
        }

    }

}

//login function
function login(){
    //store form user input in variables
    var login = document.getElementById('lusername').value;
    var password = document.getElementById('lpassword').value;
    var usersSaved = JSON.parse(localStorage.getItem('users'));
    var logged = false;

    //check that the login and password fields have been filled up
    if(login =='' || password == ''){
        //TODO: style error msg
        alert('Details incorrect');
    }
    else{
        //check does the username exist in the users list
        try{
            for(var i in usersSaved){
                if(usersSaved[i].username == login){
                    //if it does, check does the password match
                    if(usersSaved[i].password == password){
                        //if it does set the logged value to true
                        logged = true;
                        //set the index of the logged user
                        localStorage.setItem('userID', JSON.stringify(login));
                }
                }
                
            }
        } catch(err){
            console.log('no users saved');
        }

        //if the logged value is true, redirect user to home page
        //otherwise display an error msg
        if(logged == true){
            localStorage.setItem('logged', JSON.stringify(true));
            var form = document.getElementById("login-form");
            function handleForm(event) { event.preventDefault(); } 
            form.addEventListener('submit', handleForm);
            window.location.href = "index.html";
        }
        else{
        alert('Details incorrect');
        }
    }
    
    
}

//signout function
//change the localStorage logged value to false
//redirect the user to the index page
function signout(){
    localStorage.setItem('logged', JSON.stringify(false));
    localStorage.setItem('userID', JSON.stringify('null'));
    window.location.href = "index.html";

}