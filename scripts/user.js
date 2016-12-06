var database = firebase.database();
var Company_Data = database.ref('Company_Data');
var suggestions;
var user;


if (navigator.onLine) {
    database = firebase.database();
    Company_Data = database.ref('Company_Data');
    user = firebase.auth().currentUser;
    suggestions = database.ref('Suggestions');
    UserInit();
} else {
    offLineUserCards();
}

function UserInit(){

    if(user){
        var user_data = database.ref('Users/'+user.uid);
        var favArray = user_data.child('favorites');
        favArray.once('value').then(function(snapshot){
           snapshot.forEach(function(company_id){
               // console.log(company_id.val());       
               //  console.log("in foreach loop");
                var company = Company_Data.child(company_id.val());
                company.once('value').then(function(currentCompany){

                    var clone = $('#cardtemplate').clone().prop({ id: company_id.val() }).appendTo("#user_content");
                    clone.removeAttr('style');
                    
                    var cl = clone.find('.companyLogo');
                    cl.attr('src', currentCompany.child('CompanyLogo').val());

                    
                    var link = clone.find('.applyButton');
                    link.attr('href', currentCompany.child('URL').val());

                    var desc = clone.find('.companyDescription');
                    desc.text(currentCompany.child('Description').val());

                    var cn = clone.find('.companyName');
                    cn.html(currentCompany.child('name').val());
            
                    var cn = clone.find('.tags');
                    currentCompany.child('Tag').forEach(function (tagIndex) {
                        cn.append('<li class=\"tag ' + tagIndex.val() + '\">' + tagIndex.val() + "<\/li>");
                    })
                    var cp = $(clone).find('.fav');
                    cp.text("★");
                })
            })
        })
        var suggestPD = user_data.child('suggestionsPD');
        suggestPD.once('value').then(function(snapsnot){
            snapsnot.forEach(function(suggestion){
                var company = suggestions.child(suggestion.val());
                company.once('value').then(function(currentCompany){
                    var clone = $('#cardtemplate').clone().prop({ id: suggestion.val() }).appendTo("#user_content");
                    clone.removeAttr('style');
                    // var cl = clone.find('.companyLogo');
                    // cl.css("background-image", "url(" + currentCompany.child('CompanyLogo').val() + ")");
                    var cn = clone.find('.companyName');
                    cn.html(currentCompany.child('CompanyName').val());
                    // var cn = clone.find('.tags');
                    // currentCompany.child('Tag').forEach(function (tagIndex) {
                    //     cn.append('<li class=\"tag ' + tagIndex.val() + '\">' + tagIndex.val() + "<\/li>");
                    // })
                })
            })
        })


    }else{
        console.log("YOU SHALL NOT PASS!!!!");
    }
}

function offLineUserCards(){
    var company = localStorage.getItem('company_data');
    var company = JSON.parse(company);

    var userO = localStorage.getItem('user');
    var favO = JSON.parse(userO).favorites;

    $("#user_content").empty();
    $.each(favO, function (index, value) {
        var clone = $('#cardtemplate').clone().prop({ id: value }).appendTo("#user_content");
        clone.removeAttr('style');
        value = value.toString();
        companyInfo = company[value];
        var cl = clone.find('.companyLogo');
        cl.attr('src', companyInfo.CompanyLogo);
        var cn = clone.find('.companyName');
        cn.html(companyInfo.name);
        var link = clone.find('.applyButton');
        link.attr('href', companyInfo.URL);
        var desc = clone.find('.companyDescription');
        desc.text(companyInfo.Description);

        var cn = clone.find('.tags');
        $.each(companyInfo.Tag, function (index, value) {
            cn.append('<li class=\"tag ' + value + '\">' + value + "<\/li>");
        })
        var cp = $(clone).find('.fav');
        cp.text("★");
    })
}