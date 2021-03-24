let yargs = require('yargs');
let fs = require('fs');
let chalk = require('chalk');
let inquirer = require('inquirer');
let shell = require('shelljs');

let filesystem = require("./lib/filesystem");
let print = require("./lib/print");

export function cli(rawArgs) {
    global.yargs = yargs;
    global.fs = fs;
    global.chalk = chalk;
    global.inquirer = inquirer;
    global.shell = shell;

    global.rawArgs = rawArgs;

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
            choices: ["static", "php", "other"],
        },
    });

    handleCommands(args, rawArgs);
}

function handleCommands(args, rawArgs) {
    if(rawArgs.length == 2 || args.argv.help) {
        args.showHelp();
    }
    else if(args.argv._[0] == "init") {
        init(args);
    }
}


function init(args) {
    let config = {
        type: args.argv.type,
        libraries: {
            common: {
                version: "1.0.0" 
            }
        }
    }

    if(!args.argv.type) {
        inquirer.prompt([
            {
                type: "list",
                name: "type",
                message: "Type",
                choices: [
                    {
                        name: "static"
                    },
                    {
                        name: "php"
                    },
                    {
                        name: "other"
                    }
                ]
            }
        ]).then(answer => {
            config.type = answer.type;
            createConfig(config);
        })

    }
    else {
        createConfig(config);
    }
}

function createConfig(config) {
    if(!fs.existsSync(filesystem.getPath() + "config")) {
        fs.mkdirSync(filesystem.getPath() + "config");
    }
    if(!fs.existsSync(filesystem.getPath() + "config/config.json")) {
        filesystem.writeFile("config/config.json", JSON.stringify(config, null, "\t"));
        print.success("config created");
    }
    else {
        print.warning('config already exists');
    }
}