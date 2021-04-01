const YAML = require('yaml');

import { FileSystem } from "../lib/filesystem";

export class DockerFile {
    static IMAGES = {
        NODE: "node:9-slim"
    }
    /**
     * 
     * @param {string} image 
     */
    constructor(image) {
        this.file = 'FROM ' + image + '\n';
    }

    workDir(dir) {
        this.add('WORKDIR ' + dir);
    }

    copy(source, dest) {
        this.add('COPY ' + source + " " + dest);
    }

    run(command) {
        this.add('RUN ' + command);
    }

    expose(command) {
        this.add('EXPOSE ' + command);
    }

    cmd(command) {
        let array = command.split(" ");
        let output = "";
        for(let i = 0; i < array.length; i++){
            output += '"' + array[i] + '"';
            if(i != array.length - 1) {
                output += ', ';
            }
        }
        this.add('CMD [' + output + "]");
    }


    /**
     * @param {string} line
     * @private
     */
    add(line) {
        this.file += line + "\n";
    }

    /**
     * 
     * @returns {boolean} Success
     */
    create() {
        if(!FileSystem.exists("Dockerfile")){
            FileSystem.writeFile("Dockerfile", this.file);
            return true;
        }
        return false;
        
    }
    
}

export class DockerCompose {
    /**
     * Extra volumes.
     */
    static VOLUMES = {
        NODE_MODULES: "/usr/src/app/node_modules"
    }

    constructor() {
        this.compose = {
            version: "3",
            services: {

            }
        }
    }

    /**
     * 
     * @param {string} serviceName Name of the service you want to create.
     * @param {string} containerName Name of the service container.
     */
    addService(serviceName, containerName) {
        this.compose["services"][serviceName] = {
            container_name: containerName,
            restart: "always",
            build: ".",
            ports: [
                "3000:3000"
            ],
            volumes: [
                ".:/usr/src/app",
            ]
        }
    }

    /**
     * 
     * @param {string} serviceName Name of the service.
     * @param {string} volume Volume like docker volume create.
     */
    addVolume(serviceName, volume) {
        this.compose["services"][serviceName]["volumes"].push(volume);
    }

    /**
     * Converts the json object in this class to yaml string
     * @returns {string}
     */
    toYaml() {
        let doc = new YAML.Document();
        doc.contents = this.compose;
        return doc.toString();
    }

    /**
     * 
     * @returns {boolean} Success
     */
    create() {
        if(!FileSystem.exists("docker-compose.yml")){
            FileSystem.writeFile("docker-compose.yml", this.toYaml());
            return true;
        }
        return false;
    }
}