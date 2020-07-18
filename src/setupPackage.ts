import fs from "fs"

// DO NOT DELETE THIS FILE
// This file is used by build system to build a clean npm package with the compiled js files in the root of the package.
// It will not be included in the npm package.

function main() {
    const source = fs.readFileSync(__dirname + "/../package.json").toString('utf-8')
    const sourceObj = JSON.parse(source)
    
    sourceObj.scripts = {}
    sourceObj.devDependencies = {}

    if (sourceObj.main.startsWith("dist/")) {
        sourceObj.main = sourceObj.main.slice(5)
    }
    fs.writeFileSync(__dirname + "/package.json", Buffer.from(JSON.stringify(sourceObj, null, 2), "utf-8") )
    fs.writeFileSync(__dirname + "/version.txt", Buffer.from(sourceObj.version, "utf-8") )

    fs.copyFileSync(__dirname + "/../.npmignore", __dirname + "/.npmignore")
    fs.copyFileSync(__dirname + "/../README.md", __dirname + "/README.md")
}

main();