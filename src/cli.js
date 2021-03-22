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
            choices: "other"
        },
    });

    if(rawArgs.length == 2 || args.argv.help) {
        args.showHelp();
    }
    
}