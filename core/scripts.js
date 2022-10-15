#!/usr/bin/env node

const http = require("http");
const fs = require("fs-extra");
const { networkInterfaces } = require('os');

let baseDir = __dirname;
const environmentFile = `${baseDir}/src/environment.ts`;
const localHostFile = `${baseDir}/src/local-host.ts`;
const constantsFile = `${baseDir}/src/constants.ts`;
const apiDir = `${baseDir}/src/api`;

const args = process.argv.slice(2);
const getOpenApi = args[0] == "getOpenApi";
const env = args[1];

const networks = networkInterfaces();

if (env) {
  setEnvironment(env);
} else if (!fs.existsSync(environmentFile)) {
  setEnvironment(process.env.BRANCH == "main" ? "prod" : "dev");
}

if(!fs.existsSync(localHostFile)) {
  setLocalHost();
}

if(getOpenApi) {
  loadOpenApiJson();
}

function loadOpenApiJson() {
  // Since we can't load TS files here, we parse the files, kind of hacky
  const envContent = fs.readFileSync(environmentFile, { encoding: "utf8", flag: "r" });
  const environment = substringBetween(envContent, 0, '"', '"');
  const localhostContent = fs.readFileSync(localHostFile, { encoding: "utf8", flag: "r" });
  const localhost = substringBetween(localhostContent, 0, '"', '"');

  const constantsContent = fs.readFileSync(constantsFile, { encoding: "utf8", flag: "r" }).replace("${LOCAL_HOST}", localhost);
  let start = constantsContent.indexOf(` ${environment}:`, constantsContent.indexOf("API_URL"))
  start = constantsContent.indexOf(':', start) + 3;
  const baseUrl = constantsContent.substring(start, constantsContent.indexOf(',', start) - 1);
  
  fs.ensureDirSync(apiDir);
  
  const request = http.get(baseUrl + "/openapi", (response) => {
    var data = '';
    response.on('data', (chunk) => {
        data += chunk;
    });
    response.on('end', () => {
      fs.writeFileSync(apiDir + "/open-api.json", JSON.stringify(JSON.parse(data), null, 2));
    });
  });
  request.end();
}

function substringBetween(str, start, first, second) {
  start = str.indexOf(first, start) + 1;
  let end = str.indexOf(second, start);
  return str.substring(start, end);
}

function setEnvironment(env) {
  console.log(`Setting environment to ${env}`);
  fs.writeFileSync(environmentFile, `export default "${env}";`);
}

function setLocalHost() {
  let network = "localhost";

  // Try to get the IP address of local network interface
  Object.keys(networks).forEach(netName => {
    networks[netName].forEach(net => {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal && network == "localhost") {
        network = net.address;
      }
    })
  })

  // this allows the local host to be changed to your IP addres so a mobile device can call the API
  fs.writeFileSync(localHostFile, `export default "${network}";`);
}
