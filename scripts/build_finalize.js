var zip = require("./zip.js");
const fse = require("fs-extra");

var json = JSON.parse(fse.readFileSync("package.json","utf-8"));

zip.run(json.name);