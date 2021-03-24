/**
 * @param {string} path for file.
 * @param {string} content content to write to file.
 */
export function writeFile(path, content) {
    fs.writeFileSync(this.getPath() + path, content);
}

/**
* @return {string} current directory.
*/
export function getPath() {
    return process.cwd() + "/";
}