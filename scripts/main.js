// if ('serviceWorker' in navigator) {
//    navigator.serviceWorker
//             .register('./service-worker.js')
//             .then(function() { console.log('Service Worker Registered'); });
// }

var database = firebase.database();
var Company_Data = database.ref('Company_Data');

Company_Data.once('value').then(function (snapshot) {
    var index = 1;
    snapshot.forEach(function (company) {
        var clone = $('#cardtemplate').clone().prop({ id: index++ }).insertBefore("#cardtemplate");
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


firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log(user.displayName);
    }else{
        console.log("No user logged in");
    }
})


