import { Init } from './commands/init';

let yargs = require('yargs');

export function cli(rawArgs) {
    let args = yargs
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
    
    handleCommands(args, rawArgs);
}

function handleCommands(args, rawArgs) {
    if(rawArgs.length == 2 || args.argv.help) {
        args.showHelp();
    }
    else if(args.argv._[0] == "init") {
        let init = new Init();
        init.args = args;
        init.execute();
    }
}