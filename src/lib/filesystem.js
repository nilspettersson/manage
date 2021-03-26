import { basename, resolve } from 'path';

let fs = require('fs');

export class FileSystem {
    /**
     * @param {string} path for file.
     * @param {string} content content to write to file.
     */
    static writeFile(path, content) {
        fs.writeFileSync(this.getPath() + path, content);
    }

    /**
    * @return {string} current directory path.
    */
     static getPath() {
        return process.cwd() + "/";
    }

    /**
    * @return {string} current directory name.
    */
     static getName() {
        return basename(resolve(process.cwd()))
    }

    /**
    * @param {string} path Relative path.
    * @return {boolean} Returns true if path exists.
    */
    static exists(path) {
        return fs.existsSync(FileSystem.getPath() + path);
    }
}