import { Command } from "./commands/base/command";

let yargs = require('yargs');

export class Manage extends Command {
    constructor() {
        super("manage");
        this.setup();
    }

    setup() {
        this.args = yargs
        .option("help", {
            alias: "h",
        })
        .option("version", {
            alias: "v",
            global: false
        })
        .command("init", "Initilize a new project", {
            type: {
                alias: "t",
                describe: "The type of project",
                choices: ["static", "php", "node", "other"],
            },
        });
    }

    execute() {
        this.args.showHelp();
    }

} 