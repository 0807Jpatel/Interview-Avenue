function addUpdate() {
    // get ids
    var CompanyName = document.getElementById("company_name");
    var Description = document.getElementById("description");

    if (CompanyName.value == "" || Description.value == "") {
        Materialize.toast('Fields Contaning * are Mandatory', 4000);
    } else {

        var x = checkIfNameExists(CompanyName.value);

        if (!x) {
            Materialize.toast('Not a valid company', 4000);
        }
        else {
            var user = firebase.auth().currentUser;
            var database = firebase.database();
            var updates = database.ref('Updates');
            var uniqueID = updates.push({
                CompanyName: CompanyName.value,
                Description: Description.value
            });
            var updatesPD = database.ref('Users/' + user.uid + "/updatesPD");
            // var uniqueKey = (uniqueID.key).substring(1);
            updatesPD.push(uniqueID.key);
            LoadUser();
            Materialize.toast('Thank you!', 4000);
        }
    }
}

function checkIfNameExists(name) {
    var database = firebase.database();
    var company = database.ref('Company_Data');
    var x;

    company.once('value').then(function (snapshot) {

        snapshot.forEach(function (companyName) {

            x = snapshot.child(name).exists();

        })
    });

    return false;
}