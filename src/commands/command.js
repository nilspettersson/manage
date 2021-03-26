import { Print } from "../lib/print";

export class Command {
    /**
     * @param {string} name Name of the command.
     */
    constructor(name) {
        this.args = null;
        this.depth = 0;
        this.commands = [];
    }

    /**
     * @param {Command} command Command that comes after current command.
     */
    add(command) {
        command.args = this.args;
        command.depth++;
        this.commands.push(command);
    }

    execute() {
        Print.warning("No execution for this command");
    }
}