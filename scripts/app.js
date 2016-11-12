//Initialize Firebase
var config = {
    apiKey: "AIzaSyDMINrJm6ARcDPFuBOI3eHNeDPDmZkDNU0",
    authDomain: "internwebapp-b3703.firebaseapp.com",
    databaseURL: "https://internwebapp-b3703.firebaseio.com",
    storageBucket: "internwebapp-b3703.appspot.com",
    messagingSenderId: "539619981513"
};
firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');
provider.addScope('')

var googleLoginBtn2 = document.getElementById("googleLoginBtn");

googleLoginBtn.addEventListener('click', e => {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(user);
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage + '\n');
        var email = error.email;
        console.log(email + '\n');
        var credential = error.credential;
    });
})

