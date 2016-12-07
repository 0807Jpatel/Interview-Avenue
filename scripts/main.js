var database;
var Company_Data;
var currentSort = "name";

if (navigator.onLine) {
    database = firebase.database();
    Company_Data = database.ref('Company_Data');
    init(Company_Data);
} else {
    offLineCards();
}

function addtoFav(item) {
    var database = firebase.database();
    var Company_Data = database.ref('Company_Data');
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

            } else {
                favorites.child(parseInt(par)).remove();
            }
        })
        if (item.innerText == "☆") {
            item.innerText = "★";
            Materialize.toast('Favorited', 800);
        } else {
            item.innerText = "☆";
            Materialize.toast('Unfavorited', 800);
        }
    } else {
        Materialize.toast('Must be logged in to add to Favorite', 2000);
    }
}


function hideCardU(item) {
    var database = firebase.database();
    var Company_Data = database.ref('Company_Data');
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
        Materialize.toast('Card hidden', 800);
    } else {
        Materialize.toast('Must be logged in to hide', 2000);
    }
}

function updateCard(item)   {
    var user = firebase.auth().currentUser;
    if (user)   {
        UPDATECARD = $(item).parents('[id]:eq(0)');
        LoadUpdate();
    }
    else    {
        Materialize.toast('Must be logged in to update', 2000);
    }
}

function markRemoval(item) {
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
        Materialize.toast('Marked for removal', 800);
    } else {
        Materialize.toast('Must be logged in mark for removal', 2000);
    }
}
function init(Company_Data) {
    Company_Data.once('value').then(function (snapshot) {
        var index = 1;
        $("#content").empty();
        snapshot.forEach(function (company) {
            var clone = $('#cardtemplate').clone().prop({ id: company.key }).appendTo("#content");
            clone.removeAttr('style');

            var cl = clone.find('.companyLogo');
            cl.attr('src', company.child('CompanyLogo').val());

            var link = clone.find('.applyButton');
            link.attr('href', company.child('URL').val());

            var desc = clone.find('.companyDescription');
            desc.text(company.child('Description').val());

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
        saveDataLocally();
    })
}

function hideCards() {
    var user = firebase.auth().currentUser;
    if (user) {
        var hide = database.ref('Users/' + user.uid + "/hidden");
        hide.once("value").then(function (snapshot) {
            snapshot.forEach(function (hidden) {
                // console.log(hidden.val());
                document.getElementById(hidden.val()).remove();
            })
        })
    }
}

function addFavIcon() {
    var user = firebase.auth().currentUser;
    if (user) {
        var hide = database.ref('Users/' + user.uid + "/favorites");
        hide.once("value").then(function (snapshot) {
            snapshot.forEach(function (fav) {
                // console.log(hidden.val());
                var cop = document.getElementById(fav.val());
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


function sortByAlpha() {
    $("#content").empty();
    if (currentSort == "name") {
        var Company_Data = database.ref('Company_Data').orderByChild('name');
        initR(Company_Data);
        currentSort = "Rname";
    } else {
        var Company_Data = database.ref('Company_Data').orderByChild('name');
        init(Company_Data);
        currentSort = "name";
    }
}

function sortByDate() {
    $("#content").empty();
    if (currentSort == "date") {
        var Company_Data = database.ref('Company_Data').orderByChild('Date');
        initR(Company_Data);
        currentSort = "Rdate";
    } else {
        var Company_Data = database.ref('Company_Data').orderByChild('Date');
        init(Company_Data);
        currentSort = "date";
    }
}

function sortByClick() {
    $("#content").empty();
    if (currentSort == "click") {
        var Company_Data = database.ref('Company_Data').orderByChild('clicks');
        init(Company_Data);
        currentSort = "Rclick";
    } else {
        var Company_Data = database.ref('Company_Data').orderByChild('clicks');
        initR(Company_Data);
        currentSort = "click";
    }
}


function initR(Company_Data) {
    Company_Data.once('value').then(function (snapshot) {
        var index = 1;
        snapshot.forEach(function (company) {
            var clone = $('#cardtemplate').clone().prop({ id: company.key }).prependTo("#content");
            clone.removeAttr('style');
            var cl = clone.find('.companyLogo');
            cl.attr('src', company.child('CompanyLogo').val());
            var link = clone.find('.applyButton');
            link.attr('href', company.child('URL').val());
            var desc = clone.find('.companyDescription');
            desc.text(company.child('Description').val());
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
}


function applyAction(item) {
    console.log("lol");
    var par = $(item).parents('[id]:eq(0)').attr("id");
    var Company_Data = database.ref('Company_Data/' + parseInt(par) + "/clicks");
    Company_Data.once('value').then(function (snapshot) {
        var clicks = snapshot.val() + 1;
        Company_Data = database.ref('Company_Data/' + parseInt(par));
        Company_Data.update({
            clicks: clicks
        })
    });

}




function saveDataLocally() {
    Company_Data.once('value').then(function (snapshot) {
        var obj = snapshot.exportVal();
        var obj = JSON.stringify(obj);
        localStorage.setItem('company_data', obj);
    })

    var user = firebase.auth().currentUser;
    if (user)   {
        var userRef = database.ref('Users/' + user.uid);
        userRef.once('value').then(function (snapshot)  {
            var obj = snapshot.exportVal();
            obj = JSON.stringify(obj);
            localStorage.setItem('user', obj);
        })
    }
}

function offLineCards() {
    var obj = localStorage.getItem('company_data');
    var obj = JSON.parse(obj);
    $("#content").empty();
    $.each(obj, function (index, value) {
        var clone = $('#cardtemplate').clone().prop({ id: index }).appendTo("#content");
        clone.removeAttr('style');
        var cl = clone.find('.companyLogo');
        cl.attr('src', value.CompanyLogo);
        var cn = clone.find('.companyName');
        cn.html(value.name);

        var link = clone.find('.applyButton');
        link.attr('href', value.URL);

        var desc = clone.find('.companyDescription');
        desc.text(value.Description);

        var cn = clone.find('.tags');
        $.each(value.Tag, function (index, value) {
            cn.append('<li class=\"tag ' + value + '\">' + value + "<\/li>");
        })
    })

    var obj = localStorage.getItem('user');
    // console.log("outside if" + obj);
    if(obj){
        obj = JSON.parse(obj);
        obj1 = obj.favorites;
        $.each(obj1, function(index, value)  {
            // console.log(value);
            var cop = document.getElementById(value);
            var cp = $(cop).find('.fav');
            // console.log(cp);
            cp.text("★");
        })
        obj1 = obj.hidden;
    $.each(obj1, function(index, value)  {
            var cop = document.getElementById(value);
            cop.remove();
        })
    }

}

function filter() {

    var tab = $('.tab').find('.active');
    // console.log(tab.text());
    var search = document.getElementById('search');
    search = search.value.toLowerCase();

    if (tab.text() == "Search By Name") {

        $(".card-stacked").each(function (index, value) {

            var companyName = $(value).find(".companyName");
            companyName = companyName.text().toLowerCase();

            if (companyName.search(search) > -1 && companyName != "") {

                var par = $(value).parents('[id]:eq(0)');
                $(par).show();
            }
            else {
                var par = $(value).parents('[id]:eq(0)');
                $(par).hide();
            }
        })


    } else {

        $(".card-stacked").each(function (index, value) {

            var tags = $(value).find(".tags li");

            $.each(tags, function (index, value) {

                var lang = value.innerText.toLowerCase();
                // console.log(lang);

                if (lang.search(search) > -1) {
                    var par = $(value).parents('[id]:eq(0)');
                    $(par).show();
                    return false;
                }
                else {
                    var par = $(value).parents('[id]:eq(0)');
                    $(par).hide();
                }
            })
        })

    }
}

function clearSearch() {
    var search = document.getElementById('search');
    search.value = "";
    filter();
}