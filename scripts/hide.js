var user = firebase.auth().currentUser;
if(user){
        var user_data = database.ref('Users/'+user.uid);
        var favArray = user_data.child('hidden');
        favArray.once('value').then(function(snapshot){
           snapshot.forEach(function(company_id){
               // console.log(company_id.val());       
               //  console.log("in foreach loop");
                var company = Company_Data.child(company_id.val());
                company.once('value').then(function(currentCompany){

                    var clone = $('#cardtemplate').clone().prop({ id: company_id.val() }).appendTo("#hide_content");
                    clone.removeAttr('style');
                    
                    var cl = clone.find('.companyLogo');
                    cl.attr('src', currentCompany.child('CompanyLogo').val());
                    var cn = clone.find('.companyName');
                    cn.html(currentCompany.child('name').val());
                    var cn = clone.find('.tags');
                    currentCompany.child('Tag').forEach(function (tagIndex) {
                        cn.append('<li class=\"tag ' + tagIndex.val() + '\">' + tagIndex.val() + "<\/li>");
                    })
                })
            })
        })
    }else{
        console.log("YOU SHALL NOT PASS!!!!");
}

function showHidden(item){
    var user = firebase.auth().currentUser;
    if (user) {
        var par = $(item).parents('[id]:eq(0)').attr("id");
        var hide = database.ref('Users/' + user.uid + "/hidden");

        hide.once("value").then(function (snapshot) {
            hide.child(parseInt(par)).remove();            
        })

        document.getElementById(par).remove();

    } else {
        alert("Must be logged in to hide");
    }
}