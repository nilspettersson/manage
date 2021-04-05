import { Command } from "./base/command";

let shell = require('shelljs');

export class Public extends Command {
    constructor(args) {
        super("public", "Manages js, css and images", {}, args);
    }

    execute(args) {
        new Js(args).getCommand();
        new JsWatch(args).getCommand();
    }
}

class Js extends Command {
    constructor(args) {
        super("js", "Build js", {}, args);
    }

    execute() {
        shell.exec("npm run --prefix project/public js");
    }
}

class JsWatch extends Command {
    constructor(args) {
        super("js-w", "Build and watch js", {}, args);
    }

    execute() {
        shell.exec("npm run --prefix project/public js-w");
    }
}