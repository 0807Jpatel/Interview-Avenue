function myFunction() {
    var x = document.getElementById("navHeaderList");
    if (x.className === "headernavlist") {
        x.className += " responsive";
    } else {
        x.className = "headernavlist";
    }
}