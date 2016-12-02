// if ('serviceWorker' in navigator) {
//    navigator.serviceWorker
//             .register('./service-worker.js')
//             .then(function() { console.log('Service Worker Registered'); });
// }

var database = firebase.database();
var Company_Data = database.ref('Company_Data');


function addtoFav(item) {
    var user = firebase.auth().currentUser;
    if (user) {
        var par = $(item).parent().attr("id");
        var favorites = database.ref('Users/' + user.uid + "/favorites");

        favorites.once("value").then(function (snapshot) {
            var b = snapshot.child(parseInt(par)).exists(); // true
            if (!b) {
                var updates = {};
                updates[parseInt(par)] = parseInt(par);
                favorites.update(updates);
            } else {
                favorites.child(parseInt(par)).remove();
            }
        })
    } else {
        alert("Must be logged in to add to Favorite")
    }

}


function hideCardU(item) {
    var user = firebase.auth().currentUser;
    if (user) {
        var par = $(item).parent().attr("id");
        var hide = database.ref('Users/' + user.uid + "/hidden");

        hide.once("value").then(function (snapshot) {
            var b = snapshot.child(parseInt(par)).exists(); // true
            if (!b) {
                var updates = {};
                updates[parseInt(par)] = parseInt(par);
                hide.update(updates);
            } else {
                hide.child(parseInt(par)).remove();
            }
        })

        document.getElementById(par).remove();

    } else {
        alert("Must be logged in to hide");
    }
}

Company_Data.once('value').then(function (snapshot) {
    var index = 1;
    snapshot.forEach(function (company) {
        var clone = $('#cardtemplate').clone().prop({ id: index++ }).appendTo("#content");
        clone.removeAttr('style');
        var cl = clone.find('.companyLogo');
        cl.css("background-image", "url(" + company.child('CompanyLogo').val() + ")");
        var cn = clone.find('.companyName');
        cn.html(company.child('name').val());
        var cn = clone.find('.tags');
        company.child('Tag').forEach(function (tagIndex) {
            cn.append('<li class=\"tag ' + tagIndex.val() + '\">' + tagIndex.val() + "<\/li>");
        })
        // action.append('<li class="fav" id="favid"></li>');
    })
    hideCards();
})

function hideCards(){
    var user = firebase.auth().currentUser;
    if(user){
        var hide = database.ref('Users/' + user.uid + "/hidden");
        hide.once("value").then(function(snapshot){
            snapshot.forEach(function(hidden){
                console.log(hidden.val());
                document.getElementById(hidden.val()).remove();
            })
        })
    }
}


var suggest_li = document.getElementById("suggest_li");
var logout_li = document.getElementById("logout_li");
var login_li = document.getElementById("login_li");
var user_Name = document.getElementById("UserName");

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        var names = user.displayName.split(' ');

        suggest_li.style.removeProperty('display');
        logout_li.style.removeProperty('display');
        login_li.style.display = "none";

        user_Name.innerText = names[0];

    } else {

        suggest_li.style.display = "none";
        logout_li.style.display = "none";
        login_li.style.removeProperty('display');

    }
})



