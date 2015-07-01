Jaccede library
===============
JS Library to decorate a page with Jaccede data.

Usage
-----
For each place you want accessibility information, add a `<div>` where you want the Jaccede icon to appear. This `<div>` can have the following two attributes:
 - (Required) `data-jxd-name`: name of the place
 - (Required) `data-jxd-address`: address of the place
 - (Optional) `data-jxd-latitude`: latitude of the place, using decimal notation
 - (Optional) `data-jxd-longitude`: longitude of the place, using decimal notation

You load the library by first including the code:
```
<script src='path/to/jaccede.min.js'></script>
```

You then have to initialize it:
```
    var jaccedeCallback = jaccede(API_URL, API_KEY);
```

Then call `jaccedeCallback()`, without arguments, to decorate the page (e.g.: each time new places are loaded).

Files
-----
 - `js_embed/jaccede.js` contains the source code for the library
 - `js_embed/compress.js` contains the build step to compress and minify the library
 - `bin/jaccede.min.js` contains the minified, "production-ready" library

`js_embed/test` contains test files.
