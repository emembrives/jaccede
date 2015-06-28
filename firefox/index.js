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
