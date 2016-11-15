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

googleLogOut.addEventListener('click', e=>{
    firebase.auth().signOut();
})


firebase.auth().onAuthStateChanged(function(user){
    if(user){
        googleLoginBtn2.style.display = "none";
        googleLogOut.style.removeProperty('display');
        console.log(user.displayName);
    }else{
        googleLogOut.style.display = "none";
        googleLoginBtn2.style.removeProperty('display');
    }
})

