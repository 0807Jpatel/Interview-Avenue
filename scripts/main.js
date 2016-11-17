// if ('serviceWorker' in navigator) {
//    navigator.serviceWorker
//             .register('./service-worker.js')
//             .then(function() { console.log('Service Worker Registered'); });
// }

var database = firebase.database();
var Company_Data = database.ref('Company_Data');

Company_Data.once('value').then(function (snapshot) {
    $("#content").empty();
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
    })
})

var suggest_li = document.getElementById("suggest_li");
var logout_li = document.getElementById("logout_li");
var login_li = document.getElementById("login_li");
var user_Name = document.getElementById("UserName");

firebase.auth().onAuthStateChanged(function(user){
    if(user){

        var names = user.displayName.split(' ');

        suggest_li.style.removeProperty('display');
        logout_li.style.removeProperty('display');
        login_li.style.display = "none"
        
        user_Name.innerText = names[0];

    }else{

        suggest_li.style.display = "none";
        logout_li.style.display = "none";
        login_li.style.removeProperty('display');

    }
})

