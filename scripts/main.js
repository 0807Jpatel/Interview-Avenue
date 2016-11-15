if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
}

$.ajax({
    url: 'companies_info/interships.json',
    datatype: 'json',
    type: 'get',
    cache: true,
    success: function(data){
        $(data.internship).each(function(index, value){
            var clone =  $('#cardtemplate').clone().prop({ id: index}).insertBefore("#cardtemplate");
            clone.removeAttr('style'); 
            var cl = clone.find('.companyLogo');
            cl.css("background-image", "url(" + value.CompanyLogo + ")");
            var cn = clone.find('.companyName');
            cn.html(value.name);
            var cn = clone.find('.tags');
            $(value.Tag).each(function(index, value){
                cn.append('<li class=\"tag ' + value + '\">' + value + "<\/li>");
            });
        });
    }
});

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log(user.displayName);
    }else{
        console.log("No User Logged In");
    }
})


