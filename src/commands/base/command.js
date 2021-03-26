import { Print } from "../../lib/print";

export class Command {
    /**
     * @param {string} name Name of the command.
     */
    constructor(name) {
        this.name = name;
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

    /**
     *  Will execute if there is no commands comming after this one  
     */
    execute() {
        Print.warning("No execution for this command ");
    }

    /**
     *  Will check if there is a command after this one
     * if not it will execute this command.
     */
    start() {
        for(let i = 0; i < this.commands.length; i++) {
            if(this.args.argv._[this.depth] == this.commands[i].name) {
                this.commands[i].start();
                return;
            }
        }

        this.execute();
    }
}