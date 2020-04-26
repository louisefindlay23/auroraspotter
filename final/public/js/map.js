//Project: Aurora
//Group: DM Web Dev Team
//TMs: Maya Bonazarova, Louise Findlay, Miriam Wojcik, Brandon Reid
//Date: 2/3/2020
//Leaflet map implementation

//observation class
class Observation {
    constructor(username, latitude, longitude, date, time, observation_photo) {
        this.username = username;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.time = time;
        this.observation_photo = observation_photo;
    }
}


/* initialize the map */
L.mapbox.accessToken = 'pk.eyJ1IjoibWlqYW1rYSIsImEiOiJjazZ6dXpoM3QwMDBnM2xwOGlmYnJ0M2F5In0.ibAoU9L8gv4ZEFpPvz5HkQ';
var mymap = L.map('mapid').setView([54.28, -1.5147], 4).addLayer(L.mapbox.styleLayer('mapbox://styles/mijamka/ck7dxomcf1tmd1itdkpblyyom'));
var marker;


/*add the map to the screen */
function loadMap() {

    //test data to more markers at different locations
    var test_observation1 = new Observation('test1', 57.1945, -3.8238, '23/05/2019', '23:25', "<img src='../img/uploads/aurora/aurora-41.png'>");
    var test_observation2 = new Observation('test2', 58.331486, -4.438113, '21/10/2019', '11:25', "<img src='../img/uploads/aurora/aurora-43.png'>");
    var test_observation3 = new Observation('test3', 55.176515, -4.174233, '11/10/2007', '01:15',  "<img src='../img/uploads/aurora/aurora-135.png'>");
    var test_observation4 = new Observation('test4', 55.176515, -4.174233, '11/11/2015', '21:15',  "<img src='../img/uploads/aurora/aurora-177.png'>");

    //get observations details from the local storage
    var observation_records = JSON.parse(localStorage.getItem('observations'));

    //if no observations saved set observation_record to an empty array
    if (observation_records == null) {
        observation_records = [];
    }

    //add test data to the observation_records array
    observation_records.push(test_observation1, test_observation2, test_observation3, test_observation4);

    // variable for displaying uploaded photo

     var uploadedphoto = $("#uploadedphoto").attr("src");

    //for each observation create a marker and add it to the map
    //add pop ups to be displayed when user clicks on the marker with informations about username, date, time and the coordinates for the location

    for (var i in observation_records) {
        //count the total number of observations for the point
        var counter = 0;
        for (var j in observation_records) {
            if (observation_records[i].latitude == observation_records[j].latitude && observation_records[i].longitude == observation_records[j].longitude) {
                counter++;
            }
        }
        marker = L.marker([observation_records[i].latitude, observation_records[i].longitude]).addTo(mymap);
        marker.bindPopup("<b>" + observation_records[i].username + "</b><br>" + observation_records[i].latitude + ", " + observation_records[i].longitude +
            "<br>" + observation_records[i].date + "<br>" + observation_records[i].time + "<br><b>Number of observations at this location: " + counter + observation_records[i].observation_photo);
        marker.on('click', onMapClick);
    }

    /* display a weather forecast for the chosen location when user clicks on the map */

    //get location coordinates
    function onMapClick(e) {
        var lat = e.latlng["lat"];
        var lon = e.latlng["lng"];
        getWeather(lat, lon);

    }

    //on marker click display a popup
    function onMarkerClick(e) {
        var lat = e.latlng["lat"];
        var lon = e.latlng["lng"];
        getWeather(lat, lon);
    }

    mymap.on('click', onMapClick);
}

/* Adding new observations/locations to the map */

//function called when user clicks 'Record Observation' button
function recordClicked() {

    //get data from local storage to check is the user logged in
    var is_logged = JSON.parse(localStorage.getItem('logged'));

    //if user not logged in promt to log in, if they are call the function to save their location
    if (!is_logged || is_logged == null) {
        $("#record-not-logged").fadeIn();
        $("#record-not-logged").css("display", "inline-block");
        var overlay = jQuery('<div id="overlay"> </div>');
        overlay.appendTo(document.body);
    } else {
        recordNewLoc();
    }
}

//display popup box with info that will be saved for user confirmation
function recordNewLoc() {
    function showPosition(position) {

        //block other parts of website and display a pop up box
        var overlay = jQuery('<div id="overlay"> </div>');
        overlay.appendTo(document.body);
        $("#new-popup").fadeIn();
        document.getElementById('new-popup').style.display = 'inline-block';
        var popup_txt_cont = document.getElementById('popup-msg');

        //get users location
        var user_loc = [];
        user_loc[0] = position.coords.latitude;
        user_loc[1] = position.coords.longitude;

        //get current date and time
        var current_date = new Date().toLocaleString("en-GB", {
            year: "numeric",
            day: "2-digit",
            month: "2-digit"
        });
        var current_time = new Date().toLocaleString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit"
        });

        //Display data for used to review before they submit new location
        var conf_txt = 'Following details will be added to the map and visible to all users:<br><br>Location: ' + user_loc[0] + ', ' + user_loc[1] +
            '<br>Date: ' + current_date + '<br>Time: ' + current_time;

        //Display txt in the popup box
        popup_txt_cont.innerHTML = conf_txt;
        var current_user_details = [user_loc[0], user_loc[1], current_date, current_time];

        //save observation info in the local storage
        localStorage.setItem('current_user_details', JSON.stringify(current_user_details));
    }

    //Display an error msg prompting user to allow geolocation permissions in case they werent granted
    function onError(error) {
        alert('Please allow geolocation');
    }

    //get users location coordinates
    navigator.geolocation.getCurrentPosition(showPosition, onError);
}


//close popup if user clicks on Cancel button and remove the new entry data from the local storage
function cancelLocation() {
    localStorage.removeItem('current_user_details');
    document.getElementById('new-popup').style.display = 'none';
    $("#overlay").remove();
}

/* Storing and displaying new location/observation data */
/* if the user confirms they want to save the data, store them in the local storage (temporary solution) */
function addLocation() {

    //close the popup
    document.getElementById('new-popup').style.display = 'none';
    $("#overlay").remove();

    //get user's data from the temporary variable
    var username = JSON.parse(localStorage.getItem('userID'));
    var current_user_details = JSON.parse(localStorage.getItem('current_user_details'));
    var latitude = current_user_details[0];
    var longitude = current_user_details[1];
    var current_date = current_user_details[2];
    var current_time = current_user_details[3];

    var observation_photo = document.getElementById("uploadedphoto").outerHTML;
    console.log(observation_photo);
    var observations_saved = JSON.parse(localStorage.getItem('observations'));
    if (observations_saved == null) {
        observations_saved = [];
    }

    //push new data and save them in observations list in localStorage (temporary solution)
    let new_observation = new Observation(username, latitude, longitude, current_date, current_time, observation_photo);
    observations_saved.push(new_observation);
    localStorage.setItem('observations', JSON.stringify(observations_saved));

    //refresh the map
    var map = window.mymap;
    map.invalidateSize();
    loadMap();
}

//close the 'Please Log In' popup window
function closeLoginPrompt() {
    document.getElementById('record-not-logged').style.display = 'none';
    $("#overlay").remove();
}
