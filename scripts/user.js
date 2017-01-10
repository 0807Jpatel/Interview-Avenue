
var database = firebase.database();
var Company_Data = database.ref('Company_Data');
var suggestions;
var user;


function userContent() {
    $("#selector").empty();
    $("#floatingButton").empty();
    $("#floatingButton").append("<div class=\"fixed-action-btn horizontal\" style=\"right: 10%; bottom: 10%\"><a class=\"btn-floating btn-large red tooltipped\" data-position=\"top\" data-delay=\"50\" data-tooltip=\"More Options\"><i class=\"large material-icons\">mode_edit</i></a><ul><li><a class=\"btn-floating blue\" href=\"javascript:void(0)\" onclick=\"return LoadForm(this)\" title=\"Suggest New Company\"><i class=\"material-icons\">add</i></a></li><li><a class=\"btn-floating yellow darken-1\" href=\"javascript:void(0)\" onclick=\"return LoadHidden(this)\" title=\"View Hidden Cards\"><i class=\"material-icons\">visibility</i></a></li></ul></div>");
    $(document).ready(function () {
        $('.tooltipped').tooltip({ delay: 50 });
    });
    if (navigator.onLine) {
        database = firebase.database();
        Company_Data = database.ref('Company_Data');
        user = firebase.auth().currentUser;
        suggestions = database.ref('Suggestions');
        UserInit();
    } else {
        offLineUserCards();
    }
}
function UserInit() {

    if (user) {
        var user_data = database.ref('Users/' + user.uid);
        $("#content").empty();
        var favArray = user_data.child('favorites');


        favArray.once('value').then(function (snapshot) {

            if (snapshot.val() !== null) {

                snapshot.forEach(function (company_id) {
                    var company = Company_Data.child(company_id.val());
                    company.once('value').then(function (currentCompany) {

                        var clone = $('#cardtemplate').clone().prop({ id: company_id.val() }).appendTo("#content");
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
            }
            else {
                Materialize.toast("You have no favorites. Try adding some!", 4000);
            }
        })
        var suggestPD = user_data.child('suggestionsPD');
        suggestPD.once('value').then(function (snapsnot) {
            snapsnot.forEach(function (suggestion) {
                var company = suggestions.child(suggestion.val());
                company.once('value').then(function (currentCompany) {
                    var clone = $('#cardtemplate').clone().prop({ id: suggestion.val() }).appendTo("#content");
                    clone.removeAttr('style');
                    var cl = clone.find('.companyLogo');
                    if (currentCompany.child('CompanyLogo').val() === "") {
                        cl.attr('src', "images/logos/noImage.png");
                    } else {
                        var cc = firebase.storage().ref(currentCompany.child('ImageName').val());
                        cc.getDownloadURL().then(function(url) {
                            cl.attr('src', url);
                        })
                        
                    }
                    var link = clone.find('.applyButton');
                    link.attr('href', currentCompany.child('URL').val());
                    clone.find("#applyDiv").removeAttr('onclick');
                    var desc = clone.find('.companyDescription');
                    desc.text(currentCompany.child('Description').val());
                    var cn = clone.find('.companyName');
                    cn.html(currentCompany.child('CompanyName').val());
                    var cn = clone.find('.tags');
                    currentCompany.child('Tag').forEach(function (tagIndex) {
                        cn.append('<li class=\"tag ' + tagIndex.val() + '\">' + tagIndex.val() + "<\/li>");
                    })
                })
            })
        })

    }
}

function offLineUserCards() {
    var company = localStorage.getItem('company_data');
    var company = JSON.parse(company);

    var userO = localStorage.getItem('user');
    var favO = JSON.parse(userO).favorites;

    $("#content").empty();
    $.each(favO, function (index, value) {
        var clone = $('#cardtemplate').clone().prop({ id: value }).appendTo("#content");
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