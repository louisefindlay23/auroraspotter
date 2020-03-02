//observation class
class Observation {
    constructor(username, latitude, longitude, date, time) {
        this.username = username;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.time = time;
    }
}

//initialize the map
var mymap = L.map('mapid').setView([54.28, -1.5147], 4);
var marker;

function loadMap() {

    //test data
    var test_observation1 = new Observation('test1', 57.1945, -3.8238, '23/05/2019', '23:25');
    var test_observation2 = new Observation('test2', 58.331486, -4.438113, '21/10/2019', '11:25');
    var test_observation3 = new Observation('test3', 55.176515, -4.174233, '11/10/2007', '01:15');
    var test_observation4 = new Observation('test4', 55.176515, -4.174233, '11/11/2015', '21:15');




    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'sk.eyJ1IjoibWlqYW1rYSIsImEiOiJjazZ6djRiMGswczY4M2dta2gzZWNpdGc0In0.ntk0RexZw85rMtlaxpkVnQ'
    }).addTo(mymap);

    //adding markers
    var observation_records = JSON.parse(localStorage.getItem('observations'));

    
    if(observation_records != null){
        observation_records.push(test_observation1, test_observation2, test_observation3, test_observation4);
        
    }
    else{
        observation_records = [];
        observation_records.push(test_observation1, test_observation2, test_observation3, test_observation4);
    }

    for(var i in observation_records){
        //count the total number of observations for the point
        var counter = 0;
        for(var j in observation_records){
            if(observation_records[i].latitude == observation_records[j].latitude && observation_records[i].longitude == observation_records[j].longitude){
                counter ++;
            }
        }
        marker = L.marker([observation_records[i].latitude, observation_records[i].longitude]).addTo(mymap);
       marker.bindPopup("<b>" + observation_records[i].username + "</b><br>" + observation_records[i].latitude + ", " + observation_records[i].longitude +
       "<br>" + observation_records[i].date + "<br>" + observation_records[i].time + "<br><b>Number of observations at this location: " + counter);
       marker.on('click', onMapClick);
    }

    //onmap click display a weather forecast for the chosen location
    function onMapClick(e) {
        var lat = e.latlng["lat"];
        var lon = e.latlng["lng"];
        getWeather(lat, lon);

    }
    
    //on marker click display a weather forecast for the chosen location
    function onMarkerClick(e){
        var lat = e.latlng["lat"];
        var lon = e.latlng["lng"];
        getWeather(lat, lon);
    }

    mymap.on('click', onMapClick);
    

}


//function called when user clicks 'Record Observation' button
//display popup box with info that will be saved
function recordNewLoc() {

    //check if user logged in/if not, display an error msg
    var is_logged = JSON.parse(localStorage.getItem('logged'));
    if (!is_logged) {
        //display error msg/log in or close
    }

    //else
    else {
        function showPosition(position) {
            document.getElementById('new-popup').style.display = 'flex';
            var popup_txt_cont = document.getElementById('popup-msg');
            //get users location
            var user_loc = [];
            user_loc[0] = position.coords.latitude;
            user_loc[1] = position.coords.longitude;
            var current_date = new Date().toLocaleString("en-GB", {
                year: "numeric",
                day: "2-digit",
                month: "2-digit"
            });
            var current_time = new Date().toLocaleString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit"
            });
            var conf_txt = 'Following details will be added to the map and visible to all users:<br><br>Location: ' + user_loc[0] + ', ' + user_loc[1] +
                '<br>Date: ' + current_date + '<br>Time: ' + current_time;
            //Display txt in the popup box
            popup_txt_cont.innerHTML = conf_txt;
            var current_user_details = [user_loc[0], user_loc[1], current_date, current_time];
            localStorage.setItem('current_user_details', JSON.stringify(current_user_details));
        }

        function onError(error) {
            alert('Please allow geolocation');
        }


        navigator.geolocation.getCurrentPosition(showPosition, onError);
    }

}

//close popup if user clicks on Cancel button
function cancelLocation() {
    localStorage.removeItem('current_user_details');
    document.getElementById('new-popup').style.display = 'none';
}

function addLocation() {
    document.getElementById('new-popup').style.display = 'none';
    var username = JSON.parse(localStorage.getItem('userID'));
    var current_user_details = JSON.parse(localStorage.getItem('current_user_details'));
    var latitude = current_user_details[0];
    var longitude = current_user_details[1];
    var current_date = current_user_details[2];
    var current_time = current_user_details[3];
    var observations_saved = JSON.parse(localStorage.getItem('observations'));
    if (observations_saved == null) {
        observations_saved = [];
    }
    let new_observation = new Observation(username, latitude, longitude, current_date, current_time);
    observations_saved.push(new_observation);
    localStorage.setItem('observations', JSON.stringify(observations_saved));

    //refresh the map
    var map = window.mymap;
    map.invalidateSize();
    loadMap();
}




//2) check is the user logged in before adding new location

