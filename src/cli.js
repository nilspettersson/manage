import { Init } from './commands/init';
import { Public } from './commands/public';
import { Start } from './commands/start';
import { Stop } from './commands/stop';

let yargs = require('yargs');

export function cli() {
    let args = yargs
        .option("help", {
            alias: "h",
        })
        .option("version", {
            alias: "v",
            global: false
        })
        new Init(args).getCommand()
        new Start(args).getCommand()
        new Stop(args).getCommand()
        new Public(args).getCommand()
    ;

    args.parse();
    if(args.argv._.length == 0) {
        args.showHelp();
    }

}