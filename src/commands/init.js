import { DockerCompose, DockerFile } from "../create/docker";
import { PackageJson } from "../create/package-json";
import { FileSystem } from "../lib/filesystem";
import { Print } from "../lib/print";
import { Util } from "../lib/util";
import { Command } from "./base/command";

let inquirer = require('inquirer');
let shell = require('shelljs');
let fs = require('fs');

export class Init extends Command {
    constructor(args) {
        super("init", "Initilize a new project", {
            type: {
                alias: "t",
                describe: "The type of project",
                choices: ["static", "php", "node", "other"],
            },
        }, args);
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

    createGitIgnore() {
        let ignore = "/node_modules";
        if(FileSystem.writeFile(".gitignore", ignore)){
            Print.success(".gitignore created");
        }
        else {
            Print.warning(".gitignore already exists");
        }
        
    }

    createConfig(config) {
        FileSystem.createDir("config");
        if(FileSystem.writeFile("config/config.json", JSON.stringify(config, null, "\t"))) {
            Print.success("config.json created");
        }
        else {
            Print.warning('config already exists');
        }
    }

    createPackageJson(config) {
        let packageJsonServer = new PackageJson(config);
        if(config.type == "node"){
            packageJsonServer.expressDependencies();
        }
        packageJsonServer.create("/");


        let packageJson = new PackageJson(config);
        packageJson.publicDependencies();
        packageJson.create("project/public/");
    }

    createDockerfile() {
        let dockerfile = new DockerFile(DockerFile.IMAGES.NODE);
        dockerfile.workDir("/usr/src/app");
        dockerfile.copy("package.json", ".");
        dockerfile.run("npm install");
        dockerfile.copy(".", ".");
        dockerfile.expose("3000");
        dockerfile.cmd("npm run start-dev");
        if(dockerfile.create()){
            Print.success("Dockerfile created");
        }

        this.createDockerCompose();
    }

    createDockerCompose() {
        let dockerCompose = new DockerCompose();
        dockerCompose.addService("app", FileSystem.getName() + ".app");
        dockerCompose.addVolume("app", DockerCompose.VOLUMES.NODE_MODULES)
        if(dockerCompose.create()) {
            Print.success("Docker-compose.yml created");
        }
    }

    createProject(config) {
        FileSystem.createDir("project");
        FileSystem.createDir("project/controllers");
        FileSystem.createDir("project/models");
        FileSystem.createDir("project/routes");
        FileSystem.createDir("project/views");
        FileSystem.createDir("project/public");
        FileSystem.createDir("project/public/img");
        FileSystem.createDir("project/public/js");
        FileSystem.createDir("project/public/css");
        FileSystem.createDir("project/public/scss");

        FileSystem.writeFile("project/public/webpack.config.js", Util.getPreset("webpack/webpack-config"));
        FileSystem.writeFile("project/public/js/index.js", "/*Webpack entry file*/");

        if(config.type == "node") {
            if(FileSystem.writeFile("project/app.js", Util.getPreset("node/node-app"))){
                Print.success("app.js created");
            }
            else {
                Print.warning("app.js already exists");
            }
            FileSystem.writeFile("project/views/index.ejs", Util.getPreset("node/node-view"));
            FileSystem.writeFile("project/controllers/homeController.js", Util.getPreset("node/node-controller"));
            FileSystem.writeFile("project/routes/routes.js", Util.getPreset("node/node-routes"));

        }
    }

}