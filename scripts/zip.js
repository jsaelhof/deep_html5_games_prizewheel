var archiver = require("archiver");
var fse = require('fs-extra');

module.exports = {
    run: function (filename) {
        console.log("Zip");

        var output = fse.createWriteStream('target/'+filename+'.zip');
        // listen for all archive data to be written
        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
        });

        var archive = archiver('zip');
        archive.pipe(output);
        archive.directory("target/webapp/","/");
        archive.finalize();
    }
}