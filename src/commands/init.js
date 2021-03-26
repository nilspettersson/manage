import { FileSystem } from "../lib/filesystem";
import { Print } from "../lib/print";
import { Command } from "./base/command";

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
                this.init(config);
            });
    
        }
        else {
            this.init(config);
        }
    }

    init(config) {
        this.createConfig(config);
        this.createGit();
        this.createPackageJson(config);
        this.createDockerfile();
    }

    createDockerfile() {
        if(!fs.existsSync(FileSystem.getPath() + "Dockerfile")) {
            let content = 'FROM node:9-slim\n' +
            'WORKDIR /usr/src/app\n' +
            'EXPOSE 3000\n' +
            'CMD ["npm", "start"]\n';
            FileSystem.writeFile("Dockerfile", content);
            Print.success("Dockerfile created");

            this.createDockerCompose();
        }
    }

    createDockerCompose() {
        if(!fs.existsSync(FileSystem.getPath() + "docker-compose.yml")) {
            let content = 'version: "3"\n' +
            'services: \n' +
            '  app:\n' +
            '    container_name: docker-node-mongo\n' +
            '    restart: always\n' +
            '    build: .\n' +
            '    ports:\n' +
            '      - "80:3000"\n' +
            '    volumes: \n' +
            '      - .:/usr/src/app\n';
            FileSystem.writeFile("docker-compose.yml", content);
            Print.success("docker-compose created");
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