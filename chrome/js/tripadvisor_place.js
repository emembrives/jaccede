function getAllPlacesOnPage() {
    var placeElems = $("#HEADING_GROUP");
    var places = []
    placeElems.each(function(index, placeElem) {
        var name = $(placeElem).find(".heading_name").text().trim();
        var address = $(placeElem).find(".format_address").text().trim();
        var resultElem = $(placeElem).find(".heading_wrapper");
        places.push({name: name, address: address, resultElem: resultElem});
    });
    return {places: places, container: placeElems};
}
