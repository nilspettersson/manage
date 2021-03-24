import { basename, resolve } from 'path';

/**
 * @param {string} path for file.
 * @param {string} content content to write to file.
 */
export function writeFile(path, content) {
    fs.writeFileSync(this.getPath() + path, content);
}

/**
* @return {string} current directory path.
*/
export function getPath() {
    return process.cwd() + "/";
}

/**
* @return {string} current directory name.
*/
export function getName() {
    return basename(resolve(process.cwd()))
}