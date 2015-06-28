function getAllPlacesOnPage() {
    var placeElems = $(".results-item");
    var places = []
    placeElems.each(function(index, placeElem) {
        var name = $(placeElem).find(".result-title").text().trim();
        var address = $(placeElem).find(".result-info .street-name").text().trim() + " " +
            $(placeElem).find(".result-info .city").text().trim();
        var resultElem = $(placeElem).find(".result-title");
        places.push({name: name, address: address, resultElem: resultElem});
    });
    return {places: places, container: $(".results")};
}
