const fs = require('fs');
const download = require('download');
const os = require("os");
const fse = require("fs-extra");

var json = JSON.parse(fse.readFileSync("package.json","utf-8"));

// Read the version of the SDK from the package.json config node
var ver = json.config.deepsdk;

// If the output directory doesn't exist, make it.
var typesDest = "src/types/deepsdk";
if (!fs.existsSync(typesDest)) {
    fse.mkdirpSync(typesDest);
}

// Either copy the file from the .m2 directory (if SNAPSHOT) or download it from nexus (if not SNAPSHOT).
if (json.config.forceLocalMavenArtifacts || ver.indexOf("-SNAPSHOT") >= 0) {
    let home = os.homedir();
    var url = home+"/.m2/repository/deepmarkit/games/html5/libraries/deepsdk/"+ver+"/deepsdk-"+ver+".d.ts";
    if (fs.existsSync(url)) {
        fse.copySync(url,typesDest + "/deepsdk.d.ts");
    } else {
        console.log("Local DeepSDK definitions file does not exist: " + url);
    }
} else {
    var url = "http://artifacts.deepmarkit.net/service/local/repositories/releases/content/deepmarkit/games/html5/libraries/deepsdk/"+ver+"/deepsdk-"+ver+".d.ts";
    download(url).then(data => {
        fs.writeFileSync(typesDest + '/deepsdk.d.ts', data);
    });
}
