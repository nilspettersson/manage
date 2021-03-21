import arg from "arg";

function parseArguments(rawArgs) {
    let args = arg(
        {
            '--help': Boolean,
            '--version': Boolean,
            '-h': '--help',
            '-v': '--version'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        help: args['--help'] || false,
        version: args['--version'] || false,
    }
}

function getCommand(index, args){
    return args[index + 2];
}

export function cli(args) {
    if(getCommand(0, args) == "init") {
        console.log("starting stuff");
    }
    
    console.log(parseArguments(args));
}