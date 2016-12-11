if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js').then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
}

//Initialize Firebase
var loginCounter = 0;
var UPDATECARD;

var config = {
    apiKey: "AIzaSyDMINrJm6ARcDPFuBOI3eHNeDPDmZkDNU0",
    authDomain: "internwebapp-b3703.firebaseapp.com",
    databaseURL: "https://internwebapp-b3703.firebaseio.com",
    storageBucket: "internwebapp-b3703.appspot.com",
    messagingSenderId: "539619981513"
};
firebase.initializeApp(config);

function openNav() {
    document.getElementById("navHeaderList").style.display = "inline-block";
    var x = document.getElementById("mySidenav");
    x.className += " navBarOpen";
}

function closeNav() {
    document.getElementById("navHeaderList").style.removeProperty('display');
    var x = document.getElementById("mySidenav");
    x.className = "headerright";
}

function LogOut(){
    firebase.auth().signOut();
    loginCounter = 0;
    LoadContent();
    localStorage.removeItem('user');
}

