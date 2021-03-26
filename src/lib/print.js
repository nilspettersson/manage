let chalk = require('chalk');
export class Print {
    static warning(str) {
        console.log(chalk.yellow(str));
    }
    
    static success(str) {
        console.log(chalk.green(str));
    }
    
    static error(str) {
        console.log(chalk.red(str));
    }
}
