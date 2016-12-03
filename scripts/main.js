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
        // var par = $(item).parent().attr("id");
        var par = $(item).parents('[id]:eq(0)').attr("id");
        var favorites = database.ref('Users/' + user.uid + "/favorites");
        favorites.once("value").then(function (snapshot) {
            console.log(snapshot.child(parseInt(par)).val());
            var b = snapshot.child(parseInt(par)).exists(); // true
            if (!b) {
                var updates = {};
                updates[parseInt(par)] = parseInt(par);
                favorites.update(updates);
                item.innerText = "★";
            } else {
                favorites.child(parseInt(par)).remove();
                item.innerText = "☆";
            }
        })
    } else {
        alert("Must be logged in to add to Favorite")
    }
}


function hideCardU(item) {  
    var user = firebase.auth().currentUser;
    if (user) {
        var par = $(item).parents('[id]:eq(0)').attr("id");
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

function markRemoval(item)  {
        var user = firebase.auth().currentUser;
    if (user) {
        var par = $(item).parents('[id]:eq(0)').attr("id");
        var removal = database.ref('Removal');
        removal.once("value").then(function (snapshot) {
            console.log(snapshot.child(parseInt(par)).val());
            var b = snapshot.child(parseInt(par)).exists(); // true
            if (!b) {
                var remove = {};
                remove[parseInt(par)] = parseInt(par);
                removal.update(remove);
            }
        })
    } else {
        alert("Must be logged in to add to Favorite")
    }
}

Company_Data.once('value').then(function (snapshot) {
    var index = 1;
    snapshot.forEach(function (company) {
        var clone = $('#cardtemplate').clone().prop({ id: index++ }).appendTo("#content");
        clone.removeAttr('style');
        var cl = clone.find('.companyLogo');
        cl.attr('src', company.child('CompanyLogo').val());
        var cn = clone.find('.companyName');
        cn.html(company.child('name').val());
        var cn = clone.find('.tags');
        company.child('Tag').forEach(function (tagIndex) {
            cn.append('<li class=\"tag ' + tagIndex.val() + '\">' + tagIndex.val() + "<\/li>");
        })
        // action.append('<li class="fav" id="favid"></li>');
    })
    hideCards();
    addFavIcon();
})

function hideCards(){
    var user = firebase.auth().currentUser;
    if(user){
        var hide = database.ref('Users/' + user.uid + "/hidden");
        hide.once("value").then(function(snapshot){
            snapshot.forEach(function(hidden){
                // console.log(hidden.val());
                document.getElementById(hidden.val()).remove();
            })
        })
    }
}

function addFavIcon(){
    var user = firebase.auth().currentUser;
    if(user){
        var hide = database.ref('Users/' + user.uid + "/favorites");
        hide.once("value").then(function(snapshot){
            snapshot.forEach(function(fav){
                // console.log(hidden.val());
                var cop =  document.getElementById(fav.val());
                var cp = $(cop).find('.fav');
                cp.text("★");
            })
        })
    }
}




var suggest_li = document.getElementById("suggest_li");
var logout_li = document.getElementById("logout_li");
var login_li = document.getElementById("login_li");
var user_Name = document.getElementById("UserName");
var suggest_li2 = document.getElementById("suggest_li2");
var logout_li2 = document.getElementById("logout_li2");
var login_li2 = document.getElementById("login_li2");
var user_Name2 = document.getElementById("UserName2");

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        var names = user.displayName.split(' ');

        suggest_li.style.removeProperty('display');
        logout_li.style.removeProperty('display');
        login_li.style.display = "none";

        user_Name.innerText = names[0];
        suggest_li2.style.removeProperty('display');
        logout_li2.style.removeProperty('display');
        login_li2.style.display = "none";

        user_Name2.innerText = names[0];

    } else {

        suggest_li.style.display = "none";
        logout_li.style.display = "none";
        login_li.style.removeProperty('display');
        suggest_li2.style.display = "none";
        logout_li2.style.display = "none";
        login_li2.style.removeProperty('display');

    }
})



