function getAllPlacesOnPage() {
    var placeElems = $(".infoRestaurant");
    var places = []
    placeElems.each(function(index, placeElem) {
        var name = $(placeElem).find(".span10 h2").text().trim();
        var address = $(placeElem).find(".span10 p[itemprop='address']").text().trim();
        var resultElem = $(placeElem).find(".span10");
        places.push({name: name, address: address, resultElem: resultElem});
    });
    return {places: places};
}
