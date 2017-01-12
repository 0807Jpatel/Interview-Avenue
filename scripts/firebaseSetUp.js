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
    apiKey: "AIzaSyAGysWUbCf_ZXOf3x_lDiJ_S4-lvroMed4",
    authDomain: "interviewavenue.firebaseapp.com",
    databaseURL: "https://interviewavenue.firebaseio.com",
    storageBucket: "interviewavenue.appspot.com",
    messagingSenderId: "867672591721"
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

