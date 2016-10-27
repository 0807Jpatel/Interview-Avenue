function openNav() {
    document.getElementById("navHeaderList").style.display = "inline-block";
    var x = document.getElementById("mySidenav");
    x.className += " navBarOpen";
}

function closeNav() {
    document.getElementById("navHeaderList").style.removeProperty('display');
    var x = document.getElementById("mySidenav");
    x.className = "headerright";
}

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

$.ajax({
    url: 'Data/interships.json',
    datatype: 'json',
    type: 'get',
    cache: true,
    success: function(data){
        $(data.internship).each(function(index, value){
            var temp = document.getElementById("cardtemplate");
            
        });
    }
});


