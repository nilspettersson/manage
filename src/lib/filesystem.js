import { basename, resolve } from 'path';

let fs = require('fs');

export class FileSystem {
    /**
     * @param {string} path Path for file.
     * @param {string} content Content to write to file.
     * @returns {boolean}
     */
    static writeFile(path, content) {
        if(!this.exists(path)){
            fs.writeFileSync(this.getPath() + path, content);
            return true;
        }
        return false;
    }


    /**
     * @param {string} path Path for dir.
     */
    static createDir(path) {
        if(!this.exists(path)){
            fs.mkdirSync(FileSystem.getPath() + path);
            return true;
        }
            return false;
    }

    /**
    * @return {string} Current directory path.
    */
     static getPath() {
        return process.cwd() + "/";
    }

    /**
    * @return {string} Current directory name.
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