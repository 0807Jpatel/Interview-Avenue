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

app.listen(app.get('port'), function () {
  console.log('Express started press Ctrl-C to terminate');
});



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