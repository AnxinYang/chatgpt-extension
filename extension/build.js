// build.js
import fs from "fs";
import { zip } from "zip-a-folder";

const srcFolder = "./dist"; // Your dist folder

// Read the manifest.json file and parse the version
const manifestContent = fs.readFileSync(`${srcFolder}/manifest.json`, "utf-8");
const manifest = JSON.parse(manifestContent);
const version = manifest.version;

const outputZipFile = `./dist@${version}.zip`; // The name and location of the output zip file

zip(srcFolder, outputZipFile)
  .then(() => {
    console.log("Successfully created the zip file:", outputZipFile);
  })
  .catch((error) => {
    console.error("Error while creating the zip file:", error);
  });
