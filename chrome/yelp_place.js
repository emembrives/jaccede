function getAllPlacesOnPage() {
    var placeElems = $(".content-container:has(.biz-page-title)");
    var places = []
    placeElems.each(function(index, placeElem) {
        var name = $(placeElem).find(".biz-page-title").text().trim();
        var addressComponents = [];
        $(placeElem).find(".address").find("address").find("span").each(function(_, el) {
            addressComponents.push($(el).text());
        });
        var address = addressComponents.join(" ");
        var resultElem = $(placeElem).find(".biz-page-title");
        places.push({name: name, address: address, resultElem: resultElem});
    });
    return {places: places};
}
