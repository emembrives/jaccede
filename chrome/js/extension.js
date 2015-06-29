/**
 * Copyright 2015 Etienne Membrives <etienne@membrives.fr>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

function queryJaccede(name, address, latitude, longitude, resultElem) {
    var postData = {name: name, address: address}
    if (latitude != undefined && longitude != undefined) {
        postData["latitude"] = latitude;
        postData["longitude"] = longitude;
    }

    $.post("https://etienne.membrives.fr/jaccede/proxy/",
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

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var removedNodes = mutation.removedNodes;
        if( removedNodes !== null ) {
            debouncedProcessPage();
        }
    })
});

var observerConfig = { 
	attributes: false, 
	childList: true, 
	characterData: false 
};

function processPage() {
    observer.disconnect();
    $(".jaccede-accessible-div").remove();
    var pageParseResult = getAllPlacesOnPage();
    var placesOnPage = pageParseResult.places;
    for (var placeIndex in placesOnPage) {
        var place = placesOnPage[placeIndex];
        queryJaccede(
                place.name,
                place.address,
                place.latitude,
                place.longitude,
                place.resultElem);
    }
    if (pageParseResult.container != undefined) {
        observer.observe(pageParseResult.container[0], observerConfig);
    }
};

var debouncedProcessPage = debounce(processPage, 500, false);

$(document).ready(function() {
    processPage();
});
