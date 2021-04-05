const yargs = require("yargs");

export class Command {
    /**
     *  
     * @param {string} name 
     * @param {string} description 
     * @param {yargs} options 
     * @param {yargs} args 
     */
    constructor(name, description, options, args) {
        this.name = name;
        this.description = description;

        this.options = options;
        this.args = args;

        this.setup();
    }

    /**
     * @private
     */
    setup() {
        this.args.command(this.name, this.description, (args) => {
            args.options(this.options);
            this.execute(args);
        });
    }

    /**
     * 
     * @param {yargs} args Parent yargs object.
     */
    execute(args) {
        console.log("no execution");
    }

    /**
     * 
     * @returns {yargs} The command.
     */
    getCommand() {
        return this.args;
    }
}