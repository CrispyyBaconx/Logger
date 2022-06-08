/**
 * logger.js
 * @author CrispyyBaconx
 * @version 1.0.0
 * @description Logs messages to the specified logfile
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

class Logger {
    constructor(name="main", dir="./logs", cacheSize=50) {
        this.name = name;
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);
        this.path = path.join(dir, `${new Date().toISOString().replace(':', '-').replace('T', ' ').replace(':', '-').split('.')[0]}.log`);
        this.cacheSize = cacheSize;
        this.cache = [];
        this.stream = fs.createWriteStream(this.path, {flags: 'a'});
    }

    #log(level, message) {
        let output = `${new Date().toISOString().replace('T', ' ').split('.')[0]} ${this.name} ${level} ${message}`;
        this.cache.push(output);

        if(this.cache.length >= this.cacheSize) {
            this.cache.forEach(element => {
                this.stream.write(`${element}\n`);
            });
            this.cache = [];
        }
    }

    close() {
        this.cache.forEach(element => {
            this.stream.write(`${element}\n`);
        });
        this.stream.end();
    }

    info(message) { this.#log(`[Info]`, message); }
    warn(message) { this.#log(`[Warn]`, message); }
    error(message) { this.#log(`[Error]`, message); }
    fatal(message) { this.#log(`[Fatal]`, message); }
    debug(message) { this.#log(`[Debug]`, message); }
    trace(message) { this.#log(`[Trace]`, message); }
}

module.exports = Logger;