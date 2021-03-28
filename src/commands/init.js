import { DockerFile } from "../create/docker";
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
            name: FileSystem.getName(),
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
        if(config.type == "node"){
            this.createDockerfile();
        }
        this.createProject(config);
        this.createPackageJson(config);
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

    createGit() {
        shell.exec("git init");
        this.createGitIgnore();
    }

    createGitIgnore() {
        let ignore = "/node_modules";
        FileSystem.writeFile(".gitignore", ignore);
        Print.success(".gitignore created");
    }

    createDockerfile() {
        let dockerfile = new DockerFile(DockerFile.IMAGES.NODE);
        dockerfile.workDir("/usr/src/app");
        dockerfile.copy("package.json", ".");
        dockerfile.run("npm install");
        dockerfile.copy(".", ".")
        dockerfile.expose("3000")
        dockerfile.cmd("npm run start-dev");
        if(dockerfile.create()){
            Print.success("Dockerfile created");
        }

        this.createDockerCompose();
    }

    createDockerCompose() {
        let content = 'version: "3"\n' +
        'services: \n' +
        '  app:\n' +
        '    container_name: ' + FileSystem.getName() +'-docker-node\n' +
        '    restart: always\n' +
        '    build: .\n' +
        '    ports:\n' +
        '      - "3000:3000"\n' +
        '    volumes: \n' +
        '      - .:/usr/src/app\n' +
        '      - /usr/src/app/node_modules';
        FileSystem.writeFile("docker-compose.yml", content);
    }

    createProject(config) {
        fs.mkdirSync(FileSystem.getPath() + "project");
        FileSystem.createDir("project/client");
        FileSystem.createDir("project/static");

        if(config.type == "node") {
            let content = 'const express = require("express");\n' +
            'const app = express();\n' +
            'app.get("/", (request, response) => {\n' +
            '   response.send("<h1>Manage site</h1>");\n' +
            '});\n' +
            'const PORT = process.env.PORT || 3000;\n' +
            'app.listen(PORT, () => console.log("server started on port " + PORT));'

            FileSystem.writeFile("project/index.js", content);
            Print.success("index.js created");
        }
    }
    
    createPackageJson(config) {
        let packageJson = {
            name: config.name,
            version: "1.0.0",
            description: "Generated",
            main: "index.js",
            scripts: {
            },
            keywords: [],
            author: "",
            license: "ISC",
            dependencies: {},
            devDependencies: {}
        }

        if(config.type == "node") {
            packageJson.scripts["start"] = "node app/index.js";
            packageJson.scripts["start-dev"] = "nodemon project/index.js -L";
            packageJson.dependencies["express"] = "^4.17.1";
            packageJson.devDependencies["nodemon"] = "^2.0.7";
        }

        FileSystem.writeFile("package.json", JSON.stringify(packageJson, null, "\t"));
        Print.success("package.json created");
    }

}