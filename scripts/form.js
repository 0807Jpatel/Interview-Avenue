function formContent() {
    $("#selector").empty();
    $("#floatingButton").empty();
    $("#content").empty();    
    $("#content").append(" <div class=\"row\"> <form class=\"col s12\"> <h3 class=\"center\">Suggestion Form</h3> <div class=\"row\"> <div class=\"input-field col s6\"> <input id=\"first_name\" type=\"text\" class=\"validate\"> <label for=\"first_name\">First Name*</label> </div> <div class=\"input-field col s6\"> <input id=\"last_name\" type=\"text\" class=\"validate\"> <label for=\"last_name\">Last Name</label> </div> </div> <div class=\"row\"> <div class=\"input-field col s12\"> <input id=\"email\" type=\"email\" class=\"validate\"> <label for=\"email\">Email*</label> </div> </div> <div class=\"row\"> <div class=\"input-field col s12\"> <input id=\"company_name\" type=\"text\" class=\"validate\"> <label for=\"company_name\">Company Name*</label> </div> </div> <div class=\"row\"> <div class=\"input-field col s12\"> <input id=\"deadline\" type=\"date\" class=\"datepicker\"> <label>Deadline</label> </div> </div> <div class=\"row\"> <div class=\"input-field col s12\"> <input id=\"location\" type=\"text\"> <label >Location</label> </div> </div> <div class=\"row\"> <div class=\"input-field col s12\"> <input id=\"urllink\" type=\"url\" class=\"validate\"> <label >URL*</label> </div> </div><div class=\"file-field input-field\"><div class=\"btn\"><span>File</span><input id=\"uploadid\" type=\"file\"></div><div class=\"file-path-wrapper\"><input class=\"file-path validate\" type=\"text\"></div></div><div class=\"row\"> <div class=\"input-field col s12\"> <textarea id=\"description\" class=\"materialize-textarea\" length=\"200\"></textarea> <label for=\"description\">Description</label> </div> </div> <div> <p class = \"center\"> <input type=\"checkbox\" id=\"jobCB\"/> <label for=\"jobCB\">Job</label> <input type=\"checkbox\" id=\"internshipCB\"/> <label for=\"internshipCB\">Internship</label> <input type=\"checkbox\" id=\"javaCB\"/> <label for=\"javaCB\">Java</label> <input type=\"checkbox\" id=\"cppCB\"/> <label for=\"cppCB\">C++</label> <input type=\"checkbox\" id=\"javascriptCB\"/> <label for=\"javascriptCB\">Javascript</label> <input type=\"checkbox\" id=\"pythonCB\"/> <label for=\"pythonCB\">Python</label> <input type=\"checkbox\" id=\"csCB\"/> <label for=\"csCB\">C#</label> <input type=\"checkbox\" id=\"cCB\"/> <label for=\"cCB\">C</label> </p> </div> </form> </div> <!--<div class=\"button-container\"> <button type=\"button\" class=\"button\" \"><span>Submit</span></button> </div>--> <button class=\"submitButton btn waves-effect waves-light\" type=\"submit\" name=\"action\" onclick=\"addSuggest()\">Submit <i class=\"material-icons right\">send</i> </button>");

    $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
    });
}

var Name ;
var Email;
var CompanyName;
var urllink;
var ImageLink;
var Deadline;
var Locations;
var Description;
var Tag = [];

function addSuggest() {
    if (!navigator.onLine) {
        Materialize.toast("Need Connection to Submit", 4000);
    } else {
        // get ids
        Name = document.getElementById("first_name");
        Email = document.getElementById("email");
        CompanyName = document.getElementById("company_name");
        urllink = document.getElementById("urllink");
        Deadline = document.getElementById("deadline");
        Locations = document.getElementById("location");
        Upload = document.getElementById("uploadid");
        Description = document.getElementById("description");
        Tag = [];
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
            Materialize.toast('Invalid Email', 4000);
        } else if (!urlReg.test(urllink.value)) {
            Materialize.toast('Invalid URL', 4000);
        }       
        else {
            checkDupURL();
        }
    }
}

var urlExists;
var urlvalue;
function checkDupURL(){
        urlExists = false;
        urlvalue = urllink.value;
        var database = firebase.database();
        var companyData = database.ref('Company_Data');
        companyData.once('value').then(function(snapshot)   {
            snapshot.forEach(function (company) {

                var companyURL = company.child('URL').val();
                if (companyURL === urlvalue)    {
                    urlExists = true;
                }

            })
            if(urlExists){
                Materialize.toast('URL Already Exists', 4000);
            }else{
                anotherMethod();
            }        

        })
}

function anotherMethod(){
        var suggestionsData = database.ref('Suggestions');
        suggestionsData.once('value').then(function(snapshot)   {
            snapshot.forEach(function (company) {

                var companyURL = company.child('URL').val();
                if (companyURL === urlvalue)    {
                    urlExists = true;
                }
                
            })
            if(urlExists){
                Materialize.toast('URL Already Exists', 4000);
            }else{
                 formSucess();
            }  

        })
}

function formSucess(){
     var user = firebase.auth().currentUser;
            var database = firebase.database();
            var suggestions = database.ref('Suggestions/');
            var uniqueID = suggestions.push({
                name: Name.value,
                email: Email.value,
                CompanyName: CompanyName.value,
                ImageName: Upload.files[0].name,
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
            upload();
            Materialize.toast('Thank you!', 4000);
}

function upload(){
    var selectedFile =Upload.files[0];
    console.log(selectedFile);

    var storageRef = firebase.storage().ref(selectedFile.name);
    storageRef.put(selectedFile);
};