function addSuggest(){
    // get ids
    var Name = document.getElementById("first_name");
    var Email = document.getElementById("email");
    var CompanyName = document.getElementById("company_name");
    var urllink = document.getElementById("urllink");
    var Deadline = document.getElementById("deadline");
    var Locations = document.getElementById("location");
    var Description = document.getElementById("description");
    var dateReg = /^\d{2}\/\d{2}\/\d{2}$/ ;
    var urlReg = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(Name.value == "" || Email.value == "" || CompanyName.value == "" || urllink.value == ""){
        alert("Fields cointaning * are mandatory");
    }else if(!emailReg.test(Email.value)){
        alert("Invalid Email");
    }else if(!urlReg.test(urllink.value)){
        alert("Invalid URL");
    }else if (!dateReg.test(Deadline.value) && Deadline.value != ""){
        alert("Invalid Date Format");
    }
    else{
        var user = firebase.auth().currentUser;
        var database = firebase.database();
        var suggestions = database.ref('Suggestions/');
        var uniqueID =   suggestions.push({
            name: Name.value,
            email: Email.value,
            CompanyName: CompanyName.value,
            urllink: urllink.value,
            deadline: Deadline.value,
            location: Locations.value,
            Description: Description.value
        });
        var suggestionsPD = database.ref('Users/' + user.uid + "/suggestionsPD");
        // var uniqueKey = (uniqueID.key).substring(1);
        suggestionsPD.push(uniqueID.key);
        LoadUser();
        alert("Thank you!");
    }
}