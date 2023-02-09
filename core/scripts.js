#!/usr/bin/env node

const http = require("http");
const fs = require("fs-extra");
const { networkInterfaces } = require("os");

let baseDir = __dirname;
const environmentFile = `${baseDir}/src/environment.ts`;
const localHostFile = `${baseDir}/src/local-host.ts`;

const args = process.argv.slice(2);
const env = args[1];

const networks = networkInterfaces();

if (env) {
  setEnvironment(env);
} else if (!fs.existsSync(environmentFile)) {
  setEnvironment(process.env.BRANCH === "main" ? "prod" : "dev");
}

if (!fs.existsSync(localHostFile)) {
  setLocalHost();
}

function setEnvironment(env) {
  console.log(`Setting environment to ${env}`);
  fs.writeFileSync(environmentFile, `export default "${env}";`);
}

function setLocalHost() {
  let network = "localhost";

  // Try to get the IP address of local network interface
  Object.keys(networks).forEach((netName) => {
    networks[netName].forEach((net) => {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal && network == "localhost") {
        network = net.address;
      }
    });
  });

  // this allows the local host to be changed to your IP addres so a mobile device can call the API
  fs.writeFileSync(localHostFile, `export default "${network}";`);
}
