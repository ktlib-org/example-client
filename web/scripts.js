#!/usr/bin/env node

const fs = require("fs-extra");

const buildDir = "dist";
const buildIndexHtml = `${buildDir}/index.html`;

const args = process.argv.slice(2);
const postBundle = args[0] == "postBuild";

if (postBundle) {
  doPostBundle();
}

function doPostBundle() {
  const now = Date.now() + "";
  let contents = fs.readFileSync(buildIndexHtml, { encoding: "utf8", flag: "r" });
  contents = contents.replace(/BUILD_TIME/g, now);
  fs.writeFileSync(buildIndexHtml, contents);
  fs.writeFileSync(`${buildDir}/_redirects`, "/*   /index.html   200");
  fs.writeFileSync(`${buildDir}/version`, now);
}
