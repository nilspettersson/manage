let yargs = require('yargs');
let fs = require('fs');
let chalk = require('chalk');
let inquirer = require('inquirer');
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
            choices: ["other", "php"],
        },
    });
    console.log("");
    console.log(chalk.bold(chalk.green("Manage")));

    if(rawArgs.length == 2 || args.argv.help) {
        args.showHelp();
    }
    else if(args.argv._[0] == "init") {
        init(args);
    }
    
}


function init(args) {
    let content = {
        type: args.argv.type
    }

    if(!args.argv.type) {
        inquirer.prompt([
            {
                type: "list",
                name: "type",
                message: "Type",
                choices: [
                    {
                        name: "other"
                    },
                    {
                        name: "php"
                    }
                ]
            }
        ]).then(answer => {
            content.type = answer.type;
            createConfig(content);
        })

    }
    else {
        createConfig(content);
    }
}

function createConfig(content) {
    if(!fs.existsSync(FileSystem.getPath() + "config")) {
        fs.mkdirSync(FileSystem.getPath() + "config");
        
    }
    if(!fs.existsSync(FileSystem.getPath() + "config/config.json")) {
        FileSystem.writeFile("config/config.json", JSON.stringify(content));
        Print.success("config created");
    }
    else {
        Print.warning('config already exists');
    }
}

class FileSystem {
    /**
  * @param {string} path for file.
  * @param {string} content content to write to file.
  */
    static writeFile(path, content) {
        fs.writeFileSync(this.getPath() + path, content);
    }

    /**
  * @return {string} current directory.
  */
    static getPath() {
        return process.cwd() + "/";
    }
}

class Print {
    static warning(str) {
        console.log(chalk.yellow(str));
    }
    
    static success(str) {
        console.log(chalk.green(str));
    }
}
