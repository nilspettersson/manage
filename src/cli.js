let yargs = require('yargs');
let fs = require('fs');
let chalk = require('chalk');
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
            choices: "other",
        },
    });

    if(rawArgs.length == 2 || args.argv.help) {
        args.showHelp();
    }
    else if(args.argv._[0] == "init") {
        init(args.argv.type);
    }
    
}

function init(type) {
    let content = {
        type: type
    }
    if(!fs.existsSync(getPath() + "config")) {
        fs.mkdirSync(getPath() + "config");
    }
    if(!fs.existsSync(getPath() + "config/config.json")) {
        writeFile("config/config.json", JSON.stringify(content));
        console.log(chalk.green("config created"));
    }
    else {
        console.log(chalk.yellow('config already exists'));
    }
    
}

function writeFile(path, content) {
    return fs.writeFileSync(getPath() + path, content);
}

function getPath() {
    return process.cwd() + "/";
}