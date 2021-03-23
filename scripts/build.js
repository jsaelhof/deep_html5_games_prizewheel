var deepsdk = require("./deepsdk.js");
var tsc = require("./tsc.js");
var uglify = require("./uglify.js");
var license = require("./license.js");
var concat = require("./concat.js");
var copyResources = require("./copyresources.js");
var fse = require("fs-extra");

var json = JSON.parse(fse.readFileSync("package.json","utf-8"));
var name = json.name;

// Clean
fse.removeSync("target");
fse.mkdirpSync("target");

// Download the SDK
deepsdk.run( json.config.deepsdk, json.config.forceLocalMavenArtifacts, () => {
    // Compile TypeScript
    tsc.run();

    // Uglify
    uglify.run(name,"target/webapp/js","target/"+name+".js",json.config.minify != false);

    // License
    license.run("target/webapp/js/"+name+".min.js");

    // Concat
    concat.run();

    // Copy Resources
    copyResources.run();
} );