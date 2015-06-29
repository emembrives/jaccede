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

var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
 
// Yelp
pageMod.PageMod({
    include: /https?:\/\/www\.yelp\.fr\/search.*/,
    contentScriptWhen: "end",
    contentStyleFile: self.data.url("extension.css"),
    contentScriptFile: [self.data.url("js/jquery-1.11.3.min.js"), self.data.url("js/extension.js"), self.data.url("js/yelp_search.js")]
});
pageMod.PageMod({
    include: /https?:\/\/www\.yelp\.fr\/biz.*/,
    contentScriptWhen: "end",
    contentStyleFile: self.data.url("extension.css"),
    contentScriptFile: [self.data.url("js/jquery-1.11.3.min.js"), self.data.url("js/extension.js"), self.data.url("js/yelp_place.js")]
});

// La Fourchette
pageMod.PageMod({
    include: /https?:\/\/www\.lafourchette\.com\/recherche.*/,
    contentScriptWhen: "end",
    contentStyleFile: self.data.url("extension.css"),
    contentScriptFile: [self.data.url("js/jquery-1.11.3.min.js"), self.data.url("js/extension.js"), self.data.url("js/lafourchette_search.js")]
});
pageMod.PageMod({
    include: /https?:\/\/www\.lafourchette\.com\/restaurant\+.*/,
    contentScriptWhen: "end",
    contentStyleFile: self.data.url("extension.css"),
    contentScriptFile: [self.data.url("js/jquery-1.11.3.min.js"), self.data.url("js/extension.js"), self.data.url("js/lafourchette_search.js")]
});
pageMod.PageMod({
    include: /https?:\/\/www\.lafourchette\.com\/restaurant\/.*/,
    contentScriptWhen: "end",
    contentStyleFile: self.data.url("extension.css"),
    contentScriptFile: [self.data.url("js/jquery-1.11.3.min.js"), self.data.url("js/extension.js"), self.data.url("js/lafourchette_place.js")]
});

// TripAdvisor
pageMod.PageMod({
    include: /https?:\/\/www\.tripadvisor\.fr\/.*_Review-.*/,
    contentScriptWhen: "end",
    contentStyleFile: self.data.url("extension.css"),
    contentScriptFile: [self.data.url("js/jquery-1.11.3.min.js"), self.data.url("js/extension.js"), self.data.url("js/tripadvisor_place.js")]
});

// Le Fooding
pageMod.PageMod({
    include: /https?:\/\/lefooding\.com\/fr\/restaurant.*/,
    contentScriptWhen: "end",
    contentStyleFile: self.data.url("extension.css"),
    contentScriptFile: [self.data.url("js/jquery-1.11.3.min.js"), self.data.url("js/extension.js"), self.data.url("js/fooding_search.js")]
});
