const fs = require('fs');
const download = require('download');
const os = require("os");
const fse = require("fs-extra");

module.exports = {
    run: function ( ver, forceLocalMavenArtifacts, callback ) {
        console.log("DeepSDK v" + ver);

        // If the output directory doesn't exist, make it.
        var libDest = "target/temp/deepsdk";
        if (!fs.existsSync(libDest)) {
            fse.mkdirpSync(libDest);
        }

        // Either copy the file from the .m2 directory (if SNAPSHOT) or download it from nexus (if not SNAPSHOT).
        if (forceLocalMavenArtifacts || ver.indexOf("-SNAPSHOT") >= 0) {
            let home = os.homedir();
            var libUrl = home + "/.m2/repository/deepmarkit/games/html5/libraries/deepsdk/" + ver + "/deepsdk-" + ver + ".min.js";
            if (fs.existsSync(libUrl)) {
                fse.copySync(libUrl, libDest + "/deepsdk.min.js");
                callback.apply();
            } else {
                console.log("Local DeepSDK does not exist: " + libUrl);
            }
        } else {
            var libUrl = "http://artifacts.deepmarkit.net/service/local/repositories/releases/content/deepmarkit/games/html5/libraries/deepsdk/" + ver + "/deepsdk-" + ver + ".min.js";
            download(libUrl).then(data => {
                fs.writeFileSync(libDest + "/deepsdk.min.js", data);
                callback.apply();
            });
        }
    }
}



