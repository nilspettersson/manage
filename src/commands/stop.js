import { FileSystem } from '../lib/filesystem';
import { Print } from '../lib/print';
import { Command } from './base/command';

let shell = require('shelljs');

export class Stop extends Command {
    constructor(args) {
        super("stop", "Stops the app", {}, args);
    }

    execute() {
        if(FileSystem.exists("docker-compose.yml")){
            Print.info("Stopping app");
            shell.exec("docker-compose down");
        }
        else {
            Print.error("docker-compose does not exist");
        }
    }
}