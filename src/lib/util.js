const fs = require('fs');
const path = require('path');

export class Util {
    /**
     * Get presets from manage preset folder
     * @param {string} relativePath Path for preset relative to presets.
     * @returns {boolean}
     */
    static getPreset(relativePath) {
        let pathToFile = path.join(__dirname, '..', '..', 'presets', relativePath);
        return fs.readFileSync(pathToFile);
    }
}