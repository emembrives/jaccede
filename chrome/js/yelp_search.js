function getAllPlacesOnPage() {
    var placeElems = $(".biz-listing-large");
    var places = []
    placeElems.each(function(index, placeElem) {
        var name = $(placeElem).find(".biz-name").text().trim();
        var address = HTMLToText($(placeElem).find("address").html());
        var resultElem = $(placeElem).find(".media-story");
        places.push({name: name, address: address, resultElem: resultElem});
    });
    return {places: places, container: $(".search-results-content")};
}
