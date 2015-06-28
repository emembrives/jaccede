function queryJaccede(name, address, latitude, longitude, resultElem) {
    var postData = {name: name, address: address}
    if (latitude != undefined && longitude != undefined) {
        postData["latitude"] = latitude;
        postData["longitude"] = longitude;
    }

    $.post("http://localhost:9050/",
           postData,
           function(accessData){
                processJaccedeResponse(JSON.parse(accessData), resultElem);
        });
}

function processJaccedeResponse(response, elem) {
    if (response.Accessible) {
        var icon = $("<div>").addClass("jaccede-accessible-div");
        icon.append($("<a>")
            .attr("href", "http://www.jaccede.com/fr/p/" + response["JaccedeUid"])
            .attr("title", "Référencé par Jaccede.com")
            .append("<img src='http://www.jaccede.com/favicon.ico'>"));
        elem.prepend(icon);
    }
}

function HTMLToText(strData){
    return strData
        .replace("\n", " ")
        .replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/g, " ")
        .trim();
};

$(document).ready(function() {
    var placesOnPage = getAllPlacesOnPage();
    for (var placeIndex in placesOnPage) {
        var place = placesOnPage[placeIndex];
        queryJaccede(
                place.name,
                place.address,
                place.latitude,
                place.longitude,
                place.resultElem);
    }
});
