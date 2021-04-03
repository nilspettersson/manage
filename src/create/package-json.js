import { FileSystem } from "../lib/filesystem";
import { Print } from "../lib/print";

export class PackageJson {
    /**
     * 
     * @param {Object} config Json object with data from config file.
     */
    constructor(config) {
        this.config = config;
        this.packageJson = this.setup();
    }

    /**
     * @private
     */
    setup() {
        return {
            name: this.config.name,
            version: "1.0.0",
            description: "Generated",
            main: "index.js",
            scripts: {
            },
            keywords: [],
            author: "",
            license: "ISC",
            dependencies: {},
            devDependencies: {}
        }
    }
    
    /**
     * dependencies for node js backend.
     */
    expressDependencies() {
        this.packageJson.scripts["start"] = "node project/app.js";
        this.packageJson.scripts["start-dev"] = "nodemon project/app.js -L";
        
        this.packageJson.dependencies["express"] = "^4.17.1";
        this.packageJson.dependencies["ejs"] = "^3.1.6";

        this.packageJson.devDependencies["nodemon"] = "^2.0.7";
    }

    /**
     * dependencies for node js frontend.
     */
     publicDependencies() {
        this.packageJson.scripts["start"] = "webpack --config webpack.config.js";
        this.packageJson.devDependencies["webpack"] = "^5.30.0";
        this.packageJson.devDependencies["webpack-cli"] = "^4.6.0";
    }

    /**
     * 
     * @param {string} path File folder path.
     */
    create(path) {
        if(FileSystem.writeFile(path + "package.json", JSON.stringify(this.packageJson, null, "\t"))) {
            Print.success("package.json created");
        }
        else {
            Print.warning("package.json already exists");
        }
    }
}