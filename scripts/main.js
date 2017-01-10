var database;
var Company_Data;
var currentSort = "name";

function content() {

    $("#selector").empty();
    $("#selector").append("  <div class=\"row\" style=\"margin-bottom: 5px;\"><div class=\"col s12\"><ul class=\"tabs\"><li class=\"tab col s6\"><a class=\"active\" id=\"searchByNameId\" style=\"color: #3EACA8\" onclick=\"activeSearch()\">Search By Name</a></li><li class=\"tab col s6\" onclick=\"activeSearch()\"><a style=\"color: #3EACA8\">Search By Tag</a></li></ul></div></div>");
    $("#selector").append("    <nav style=\"background-color: #3EACA8\"><div class=\"nav-wrapper\"><form><div class=\"input-field\"><input id=\"search\" type=\"search\" required onkeyup=\"filter()\" autocomplete=\"off\"><label for=\"search\"><i class=\"material-icons\">search</i></label><i class=\"material-icons\" onclick=\"clearSearch()\">close</i></div></form></div></nav>");
    $('ul.tabs').tabs();
    $("#floatingButton").empty();
    if (navigator.onLine) {
        $("#floatingButton").append("<div class=\"fixed-action-btn horizontal\" style=\"right: 10%; bottom: 10%\"><a class=\"btn-floating btn-large red lighten-1 tooltipped\" data-position=\"top\" data-delay=\"50\" data-tooltip=\"Sort\"><i class=\"large material-icons\">sort_by_alpha</i> </a><ul><li><a class=\"btn-floating deep-purple lighten-1\" href=\"javascript:void(0)\" onclick=\"return sortByAlpha(this)\" title=\"Sort By Alphabet\"><i class=\"material-icons\">sort_by_alpha</i></a></li><li><a class=\"btn-floating light-green accent-4\" href=\"javascript:void(0)\" onclick=\"return sortByDate(this)\" title=\"Sort By Deadline\"><i class=\"material-icons\">schedule</i></a></li><li><a class=\"btn-floating amber darken-4\" href=\"javascript:void(0)\" onclick=\"return sortByClick(this)\" title=\"Sort By Trending\"><i class=\"material-icons\">trending_up</i></a></li></ul></div>");
        database = firebase.database();
        Company_Data = database.ref('Company_Data');
        $(document).ready(function () {
            $('.tooltipped').tooltip({ delay: 50 });
        });
        init(Company_Data);
    } else {
        offLineCards();
    }
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

function updateCard(item) {
    var user = firebase.auth().currentUser;
    if (user) {
        UPDATECARD = $(item).parents('[id]:eq(0)');
        LoadUpdate();
    }
    else {
        Materialize.toast('Must be logged in to update', 2000);
    }
}

function markRemoval(item) {
    var user = firebase.auth().currentUser;
    if (user) {
        var par = $(item).parents('[id]:eq(0)').attr("id");
        var removal = database.ref('Removal');
        removal.once("value").then(function (snapshot) {
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
        var cc = false;
        if (firebase.auth().currentUser) {
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
                })            // action.append('<li class="fav" id="favid"></li>');
            })
            hideCards();
            addFavIcon();
        } else {
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
                var cp = $(clone).find('.fav');
                cp.css('color', 'grey');
                var cr = $(clone).find('.removalButton');
                cr.css('color', 'grey');
                var ch = $(clone).find('.hideButton');
                ch.css('color', 'grey');
                var cu = $(clone).find('.updateButton');
                cu.css('color', 'grey');
            })
        }
        saveDataLocally();
    })
}

function hideCards() {
        var hide = database.ref('Users/' + user.uid + "/hidden");
        hide.once("value").then(function (snapshot) {
            snapshot.forEach(function (hidden) {
                document.getElementById(hidden.val()).remove();
            })
        })
}

function addFavIcon() {
        var hide = database.ref('Users/' + user.uid + "/favorites");
        hide.once("value").then(function (snapshot) {
            snapshot.forEach(function (fav) {
                var cop = document.getElementById(fav.val());
                var cp = $(cop).find('.fav');
                cp.text("★");
            })
        })
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

        loginCounter++;
        if (loginCounter == 1) {
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        }


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
    if (user) {
        var userRef = database.ref('Users/' + user.uid);
        userRef.once('value').then(function (snapshot) {
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
    if (obj) {
        obj = JSON.parse(obj);
        obj1 = obj.favorites;
        $.each(obj1, function (index, value) {
            var cop = document.getElementById(value);
            var cp = $(cop).find('.fav');
            cp.text("★");
        })
        obj1 = obj.hidden;
        $.each(obj1, function (index, value) {
            var cop = document.getElementById(value);
            cop.remove();
        })
    }

}

function filter() {

    var tab = $('.tab').find('.active');
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

function activeSearch() {
    var search = document.getElementById('search');
    search.focus();
}


function clearSearch() {
    var search = document.getElementById('search');
    search.value = "";
    filter();
}