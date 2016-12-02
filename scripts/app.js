var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');
provider.addScope('')

var googleLoginBtn2 = document.getElementById("googleLoginBtn");
var googleLogOut = document.getElementById("SignOutButton");

googleLoginBtn.addEventListener('click', e => {
    firebase.auth().signInWithPopup(provider)
    .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage + '\n');
        var email = error.email;
        console.log(email + '\n');
        var credential = error.credential;
    });
    
})

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        counter++;
        if(counter == 1){
        googleLogOut.style.removeProperty('display');
        googleLoginBtn2.style.display = "none";

        console.log(user.displayName);
        console.log(user.email);
        console.log(user.uid);
        
        writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        console.log("counter = " + counter);
        LoadUser();
        }
    }else{
        googleLogOut.style.display = "none";
        googleLoginBtn2.style.removeProperty('display');
    }
    return;
})

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('Users/' + userId).update({
    username: name,
    email: email,
    profile_picture : imageUrl,
  });
  console.log("User added to the database.");
}
