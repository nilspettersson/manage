import { DockerFile } from "../create/docker";
import { PackageJson } from "../create/package-json";
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
        this.createGit();
        this.createConfig(config);
        if(config.type == "node"){
            this.createDockerfile();
        }
        this.createProject(config);
        this.createPackageJson(config);
    }

    createGit() {
        shell.exec("git init");
        this.createGitIgnore();
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

    createPackageJson(config) {
        let packageJson = new PackageJson(config);
        if(config.type == "node"){
            packageJson.expressDependencies();
        }
        packageJson.create("/");
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
        FileSystem.createDir("project");
        FileSystem.createDir("project/controllers");
        FileSystem.createDir("project/models");
        FileSystem.createDir("project/routes");
        FileSystem.createDir("project/views");
        FileSystem.createDir("project/public");
        FileSystem.createDir("project/public/img");
        FileSystem.createDir("project/public/css");
        FileSystem.createDir("project/public/scss");

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

}