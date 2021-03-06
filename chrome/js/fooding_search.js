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
