function addSuggest() {
    if (!navigator.onLine) {
        Materialize.toast("Need Connection to Submit", 4000);
    } else {
        // get ids
        var Name = document.getElementById("first_name");
        var Email = document.getElementById("email");
        var CompanyName = document.getElementById("company_name");
        var urllink = document.getElementById("urllink");
        var ImageLink = document.getElementById("imageurllink");
        var Deadline = document.getElementById("deadline");
        var Locations = document.getElementById("location");
        var Description = document.getElementById("description");
        var Tag = [];
        $(':checkbox').each(function(index, value){
            if(value.checked){
                var id = value.id;
                Tag.push($('label[for='+id +']').text());
            }
        });


        var urlReg = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (Name.value == "" || Email.value == "" || CompanyName.value == "" || urllink.value == "") {
            Materialize.toast('Fields Contaning * are Mandatory', 4000);
        } else if (!emailReg.test(Email.value)) {
            Materialize.toast('Invalid Email', 4000)
        } else if (!urlReg.test(urllink.value)) {
            Materialize.toast('Invalid URL', 4000)
        } else {
            var user = firebase.auth().currentUser;
            var database = firebase.database();
            var suggestions = database.ref('Suggestions/');
            var uniqueID = suggestions.push({
                name: Name.value,
                email: Email.value,
                CompanyName: CompanyName.value,
                CompanyLogo: ImageLink.value,
                URL: urllink.value,
                Date: Deadline.value,
                location: Locations.value,
                Description: Description.value,
                Tag: Tag
            });
            var suggestionsPD = database.ref('Users/' + user.uid + "/suggestionsPD");
            // var uniqueKey = (uniqueID.key).substring(1);
            suggestionsPD.push(uniqueID.key);
            LoadUser();
            Materialize.toast('Thank you!', 4000);
        }
    }
}