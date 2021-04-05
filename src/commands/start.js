import { FileSystem } from '../lib/filesystem';
import { Print } from '../lib/print';
import { Command } from './base/command';

let shell = require('shelljs');

export class Start extends Command {
    constructor(args) {
        super("start", "Starts the app", {
            detached: {
                alias: "d",
                describe: "Detached mode",
            }
        }, args);
    }

    execute() {
        if(FileSystem.exists("docker-compose.yml")){
            Print.info("Starting app");
            if(this.args.argv.detached){
                shell.exec("docker-compose up --build -d");
                return;
            }
            shell.exec("docker-compose up --build");
        }
        else {
            Print.error("docker-compose does not exist");
        }
    }
}