const fs = require('fs');

module.exports = {
    run: function (inputFile, licenseText) {
        if (licenseText == undefined) {
            licenseText = "\n/*\n" +
                "* Copyright (C) DeepMarkit, Inc - All Rights Reserved\n" +
                "* Unauthorized copying of this file, via any medium is strictly prohibited\n" +
                "* Proprietary and confidential\n" +
                "*/\n";
        }

        console.log("License: " + inputFile);

        var contents = fs.readFileSync(inputFile, "utf8");

        fs.writeFileSync(inputFile,licenseText + contents);
    }
};

