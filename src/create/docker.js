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