function getAllPlacesOnPage() {
    var placeElems = $(".resultItem");
    var places = []
    placeElems.each(function(index, placeElem) {
        var name = $(placeElem).find(".resultItem-name").text().trim();
        var address = $(placeElem).find(".resultItem-address").text().trim();
        var resultElem = $(placeElem).find("div.span9");
        places.push({name: name, address: address, resultElem: resultElem});
    });
    return {places: places};
}
