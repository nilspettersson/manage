let yargs = require('yargs');
let fs = require('fs');

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
    try {
        fs.mkdirSync(getPath() + "config");
    }
    catch(error) {
    }
    

    writeFile("config/config.json", JSON.stringify(content));
    
}

function writeFile(path, content) {
    return fs.writeFileSync(getPath() + path, content);
}

function getPath() {
    return process.cwd() + "/";
}