var UglifyJS = require('uglify-js');
var fs = require('fs');

var result = UglifyJS.minify('extension.js', {
	mangle: true,
	compress: {
		sequences: true,
		dead_code: true,
		conditionals: true,
		booleans: true,
		unused: true,
		if_return: true,
		join_vars: true,
        loops: true
	}
});

fs.writeFileSync('../bin/jaccede.min.js', result.code);

