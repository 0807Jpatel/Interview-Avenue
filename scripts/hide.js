var user;
function hiddenContent() {

    if (navigator.onLine) {
        $("#floatingButton").empty();
        user = firebase.auth().currentUser;
        HideInit();
    } else {
        offLineHideCards();
    }
}

function HideInit() {
    if (user) {
        var user_data = database.ref('Users/' + user.uid);
        var favArray = user_data.child('hidden');
        $("#content").empty();
        favArray.once('value').then(function (snapshot) {

            if (snapshot.val() !== null) {
                snapshot.forEach(function (company_id) {
                    var company = Company_Data.child(company_id.val());
                    company.once('value').then(function (currentCompany) {

                        var clone = $('#cardtemplate').clone().prop({ id: company_id.val() }).appendTo("#content");
                        clone.removeAttr('style');

                        var cl = clone.find('.companyLogo');
                        cl.attr('src', currentCompany.child('CompanyLogo').val());

                        var desc = clone.find('.companyDescription');
                        desc.text(currentCompany.child('Description').val());

                        var cn = clone.find('.companyName');
                        cn.html(currentCompany.child('name').val());

                        var cn = clone.find('.tags');
                        currentCompany.child('Tag').forEach(function (tagIndex) {
                            cn.append('<li class=\"tag ' + tagIndex.val() + '\">' + tagIndex.val() + "<\/li>");
                        })
                        clone.find('.favButton').remove();
                        clone.find('.removalButton').remove();
                        clone.find('.hideButton').remove();
                        clone.find('.updateButton').remove();
                        clone.find('.companyInfo').prepend("<a class=\"hideButton\" id=\"hideid\" href=\"javascript:void(0)\" onclick=\"return showHidden(this);\" title=\"Unhide Card\"><i class=\"material-icons\">visibility</i></a>");

                    })
                })
            }
            else {
                Materialize.toast("You have no hidden cards right now.", 4000);
            }
        })
    }
}

function showHidden(item) {
    var user = firebase.auth().currentUser;
    if (user) {
        var par = $(item).parents('[id]:eq(0)').attr("id");
        var hide = database.ref('Users/' + user.uid + "/hidden");

        hide.once("value").then(function (snapshot) {
            hide.child(parseInt(par)).remove();
        })

        document.getElementById(par).remove();
        Materialize.toast('Unhidden', 800);


    } else {
        alert("Must be logged in to hide");
    }
}

function offLineHideCards() {
    var company = localStorage.getItem('company_data');
    var company = JSON.parse(company);

    var userO = localStorage.getItem('user');
    var favO = JSON.parse(userO).hidden;

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
    })
}