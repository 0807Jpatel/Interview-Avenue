var express = require("express");
var app = express();
var path = require("path");
//var mongo = require('mongodb');
var firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: "InternWebApp-da144332b983.json",
  databaseURL: "https://internwebapp-b3703.firebaseio.com/"
})

var ref = firebase.database().ref();


app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname));
app.get('/', function (req, res, next) {
  res.render('index.html');
});

app.get('/login', function(req, res, next){
  res.render('login.html');
})


app.listen(3000);

console.log("Running at Port 3000");

// app.listen(app.get('port'), function () {
//   console.log('Express started press Ctrl-C to terminate');
// });



// app.get('/', function (req, res) {
  //  ref.push({
  //   Username: "0807Jpatel",
  //   id: 1023,
  //   token: "1234asdf123e",
  //   email: "0807Jpatel@gmail.com"
  //  })
  //   ref.push({
  //   Username: "0807Rpatel",
  //   id: 1024,
  //   token: "1234asdf123f",
  //   email: "0807Rpatel@gmail.com"
  //  })
  //   ref.push({
  //   Username: "0807Jatel",
  //   id: 1025,
  //   token: "1234asdf123g",
  //   email: "randomemail1@gmail.com"
  //  })
  //     ref.push({
  //   Username: "080Jpatel",
  //   id: 1026,
  //   token: "1234asdf123h",
  //   email: "randomemail2@gmail.com"
  //  })
    // res.render('login.html');
    // ref.once('value')
    //   .then(function(snap){
    //     console.log(snap.val());
    //   })

// });


function onSignIn(googleUser) {
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.getAuthResponse().id_token);
      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    } else {
      console.log('User already signed-in Firebase.');
    }
  });
}

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}
