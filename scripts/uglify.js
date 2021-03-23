const fse = require('fs-extra');
const uglifyjs = require("uglify-js");

module.exports = {
    run: function (outputFileName,outputDir,inputFile,minify) {
        var outputFile = outputDir + "/" + outputFileName + ".min.js";

        fse.mkdirpSync(outputDir);

        if (minify) {
            console.log("Uglify (Minify): " + inputFile);
            var result = uglifyjs.minify(inputFile);
            fse.writeFileSync(outputFile, result.code);
        } else {
            console.log("Skip Uglify (No Minify): " + inputFile);
            fse.copySync(inputFile,outputFile);
        }
    }
};