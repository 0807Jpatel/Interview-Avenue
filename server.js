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
app.use(express.static(__dirname));
app.get('/', function (req, res, next) {
  res.render('index.html');
});

app.get('/login', function (req, res) {
  ref.push({
    Username: "0807Jpatel",
    id: 1023,
    token: "1234asdf123e",
    email: "0807Jpatel@gmail.com"
  })

});

























// app.get('/login', function (req, res) {
//   var Mongo = mongo.MongoClient;
//   var url = 'mongodb://localhost:27017/samplesite';
//   Mongo.connect(url, function (err, db) {
//     if (err) {
//       console.log("you fucked up", err);
//     } else {
//       var collection = db.collection('student');
//       collection.find({}).toArray(function(err, result){
//          console.log(result.length);
//           if(err){
//               console.log("you fucked up again");
//           }else if(result.length){
//               console.log(collection.collectionName);
//               console.log(result);
//           }else{
//               console.log("no doc");
//           }
//           db.close();
//       });    

//       // var user1 = { name: 'modulus admin'};
//       // var user2 = { name: 'modulus user' };
//       // var user3 = { name: 'modulus super admin'};

//       // collection.insert([user1, user2, user3], function (err, result) {
//       //   if (err) {
//       //     console.log(err);
//       //   } else {
//       //     console.log(result);
//       //   }
//       //   //Close connection
//       //   db.close();
//       // });
//     }
//   });
// });

//app.use('/', router);

app.listen(3000);

console.log("Running at Port 3000");

app.listen(app.get('port'), function () {
  console.log('Express started press Ctrl-C to terminate');
});
