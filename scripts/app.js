var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');
provider.addScope('')

var googleLoginBtn2 = document.getElementById("googleLoginBtn");
googleLoginBtn.addEventListener('click', e => {
    firebase.auth().signInWithRedirect(provider);


    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // ...
        }
        // The signed-in user info.
        var user = result.user;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

    // firebase.auth().signInWithRedirect(provider)
    //     .catch(function (error) {
    //         var errorCode = error.code;
    //         var errorMessage = error.message;
    //         console.log(errorMessage + '\n');
    //         var email = error.email;
    //         console.log(email + '\n');
    //         var credential = error.credential;
    // });

})

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        counter++;
        if (counter == 1) {
            googleLoginBtn2.style.display = "none";

            console.log(user.displayName);
            console.log(user.email);
            console.log(user.uid);

            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
            console.log("counter = " + counter);
            LoadUser();
        }
    } else {
        googleLoginBtn2.style.removeProperty('display');
    }
    return;
})

function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('Users/' + userId).update({
        username: name,
        email: email,
        profile_picture: imageUrl,
    });
    console.log("User added to the database.");
}
