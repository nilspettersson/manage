import { FileSystem } from "../lib/filesystem";
import { Print } from "../lib/print";
import { Command } from "./command";

let inquirer = require('inquirer');
let shell = require('shelljs');
let fs = require('fs');

export class Init extends Command {
    constructor() {
        super("init");
    }

    execute() {
        let config = {
            type: this.args.argv.type,
            libraries: {
                common: {
                    version: "1.0.0" 
                }
            }
        }
    
        if(!this.args.argv.type) {
            inquirer.prompt([
                {
                    type: "list",
                    name: "type",
                    message: "Type",
                    choices: [
                        {
                            name: "static"
                        },
                        {
                            name: "php"
                        },
                        {
                            name: "node"
                        },
                        {
                            name: "other"
                        }
                    ]
                }
            ]).then(answer => {
                config.type = answer.type;
                this.createConfig(config);
                this.createGit();
                this.createPackageJson(config);
            });
    
        }
        else {
            this.createConfig(config);
            this.createGit();
            this.createPackageJson(config);
        }
    }
    
    createGit() {
        shell.exec("git init");
        this.createGitIgnore();
    }
    
    createGitIgnore() {
        if(!fs.existsSync(FileSystem.getPath() + ".gitignore")) {
            let ignore = "/node_modules";
            FileSystem.writeFile(".gitignore", ignore);
            Print.success(".gitignore created");
        }
    }
    
    createPackageJson(config) {
        if(!fs.existsSync(FileSystem.getPath() + "package.json")) {
            let name = FileSystem.getName();
            let packageJson = {
                name: name,
                version: "0.1.0",
                description: "cli management tool",
                main: "index.js",
                scripts: {
    
                },
                keywords: [],
                author: "",
                license: "ISC",
                dependencies: {
    
                }
            }
    
            if(config.type == "node") {
                packageJson.scripts["start"] = "node app/index.js";
                packageJson.dependencies["express"] = "^4.17.1";
            }
    
            FileSystem.writeFile("package.json", JSON.stringify(packageJson, null, "\t"));
            Print.success("package.json created");
        }
    
        shell.exec("npm install");
    }
    
    createConfig(config) {
        if(!fs.existsSync(FileSystem.getPath() + "config")) {
            fs.mkdirSync(FileSystem.getPath() + "config");
        }
        if(!fs.existsSync(FileSystem.getPath() + "config/config.json")) {
            FileSystem.writeFile("config/config.json", JSON.stringify(config, null, "\t"));
            Print.success("config.json created");
        }
        else {
            Print.warning('config already exists');
        }
    }

}