import { Command } from "./base/command";

let shell = require('shelljs');

export class Public extends Command {
    constructor() {
        super("public");
    }

    execute() {
        //shell.exec("npm run --prefix project/public js-w");
    }
}