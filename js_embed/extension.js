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

function jaccede(API_URL, API_KEY) {
    function _queryJaccede(name, address, latitude, longitude, resultElem) {
        var postData = {name: name, address: address, key: API_KEY}
        if (latitude != undefined && longitude != undefined) {
            postData["latitude"] = latitude;
            postData["longitude"] = longitude;
        }

        var request = new XMLHttpRequest();
        request.open('POST', API_URL, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    // Success!
                    _processJaccedeResponse(JSON.parse(this.responseText), resultElem);
                } else {
                    console.log(this.status);
                }
            }
        };

        request.send(postData);
        request = null;
    }

    function _addClass(el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }

    function _processJaccedeResponse(response, elem) {
        if (response.Accessible) {
            var icon = document.createElement("div");
            _addClass(icon, 'jaccede-accessible-icon');
            icon.innerHTML = "<a title='Référencé par Jaccede.com'><img src='http://www.jaccede.com/favicon.ico'></a>";
            icon.firstChild.setAttribute('href', "http://www.jaccede.com/fr/p/" + response["JaccedeUid"]);
            elem.insertBefore(icon, elem.firstChild);
        }
    }

    function processPage() {
        var jaccedePlaces = document.querySelectorAll(".jaccede-accessible-div");
        for (var placeIndex = 0; placeIndex < jaccedePlaces.length; placeIndex++) {
            var placeEl = jaccedePlaces[placeIndex];
            // Clear any previous invocation.
            placeEl.innerHTML = '';
            _queryJaccede(
                    placeEl.getAttribute('data-jxd-name'),
                    placeEl.getAttribute('data-jxd-address'),
                    placeEl.getAttribute('data-jxd-latitude'),
                    placeEl.getAttribute('data-jxd-longitude'),
                    placeEl);
        }
    };

    return processPage;
}
