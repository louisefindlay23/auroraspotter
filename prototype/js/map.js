var mymap = L.map('mapid').setView([54.28, -1.5147], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'sk.eyJ1IjoibWlqYW1rYSIsImEiOiJjazZ6djRiMGswczY4M2dta2gzZWNpdGc0In0.ntk0RexZw85rMtlaxpkVnQ'
}).addTo(mymap);

//adding markers
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//popups
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

//map click function
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);

}
mymap.on('click', onMapClick);


//function called when user clicks 'Record Observation' button
//display popup box with info that will be saved
function recordNewLoc(){
    

    
    function showPosition(position) {
        document.getElementById('new-popup').style.display = 'block';
        var popup_txt_cont =  document.getElementById('popup-msg');
        //get users location
        var user_loc = []; 
        user_loc[0] = position.coords.latitude;
        user_loc[1] = position.coords.longitude;
        var current_date = new Date().toLocaleString("en-GB", {year:"numeric", day:"2-digit", month:"2-digit"});
        var current_time = new Date().toLocaleString("pl-PL", {hour:"2-digit", minute:"2-digit"});
        var conf_txt = 'Following details will be added to the map and visible to all users:<br><br>Location: ' + user_loc[0] + ', ' + user_loc[1] + 
                    '<br>Date: ' + current_date + '<br>Time: ' + current_time;
        //Display txt in the popup box
        popup_txt_cont.innerHTML = conf_txt;
      }

      function onError(error) {
        alert('Please allow geolocation');
        }
   
      
        navigator.geolocation.getCurrentPosition(showPosition, onError);
    
    
}

//close popup if user clicks on Cancel button
function cancelLocation(){
    document.getElementById('new-popup').style.display = 'none';
}

function addLocation(){
    console.log('test');
}

//1) user clicks on register loc button:
    //pop up window -> the observation for the location, date, time -> save / cancel
    //get username
    //get time
    //get location
    //save in the localStorage markers
    //reload map

//2) create markers for each location
    //read locations from the storage
    //loop to create all markers
    //In the marker show: coordinates, date, time, username (what if the location already saved?)

//3) when user click on the map - show the weather for chosen location


//create few sample markers