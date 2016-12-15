// document.getElementById("#updateTitle").innerText = ("Update Form for " + (UPDATECARD).find(".companyName").text());
var companyName = UPDATECARD.find(".companyName").text();
$("#updateTitle").text("Update Form for " + companyName);

function updateContent() {
    $("#selector").empty();
    $("#floatingButton").empty();
    $("#content").empty();    
    $("#content").append(" <div class=\"row\"> <form class=\"col s12\"> <h3 id=\"updateTitle\" class=\"center\">Update Form</h3> <div class=\"row\"> <div class=\"input-field col s12\"> <textarea id=\"description\" class=\"materialize-textarea\" length=\"200\"></textarea> <label for=\"description\">What needs updating?*</label> </div> </div> </form> </div> <button class=\"updateButton btn waves-effect waves-light\" type=\"submit\" name=\"action\" onclick=\"addUpdate()\">Submit <i class=\"material-icons right\">send</i> </button>");
}
function addUpdate() {
    // get ids
    var Description = document.getElementById("description");

    if (Description.value == "") {
        Materialize.toast('Fields Contaning * are Mandatory', 4000);
    } else {
        // var user = firebase.auth().currentUser;
        var database = firebase.database();
        var updates = database.ref('Updates');
        var par = $(UPDATECARD).attr("id");
        var updatesArr = {};
        updatesArr[parseInt(par)] = Description.value;
        updates.update(updatesArr);
        // var updatesPD = database.ref('Users/' + user.uid + "/updatesPD");
        // var uniqueKey = (uniqueID.key).substring(1);
        // updatesPD.push(uniqueID.key);
        LoadContent();
        Materialize.toast('Thank you!', 4000);
    }
}

function checkIfNameExists(name) {
    var database = firebase.database();
    var company = database.ref('Company_Data');
    var boolean = false;

    company.once('value').then(function (snapshot) {

        snapshot.forEach(function (companyName) {
            var x = snapshot.child(name).exists();
            if(x){
                boolean = true;
            }
        })
    });

    return boolean;
}