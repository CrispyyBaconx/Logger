import fs from 'fs';
import path from 'path';

class Logger {
    private name: string = "main";
    private dir: string = "./logs";
    private cacheSize: number = 50;
    private cache: string[];
    private stream: fs.WriteStream;

    private static instance: Logger;

    private constructor(name?: string, dir?: string, cacheSize?: number) {
        if (name) this.name = name;
        if (dir) this.dir = dir;
        if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir);
        if (cacheSize) this.cacheSize = cacheSize;
        this.cache = [];
        this.stream = fs.createWriteStream(path.join(this.dir, `${new Date().toISOString().replace(':', '-').replace('T', ' ').replace(':', '-').split('.')[0]}.log`), { flags: 'a' });
    }

    private log(level: string, message: string): void {
        const output = `${new Date().toISOString().replace('T', ' ').split('.')[0]} ${this.name} ${level} ${message}`;
        this.cache.push(output);

        if (this.cache.length >= this.cacheSize) {
            this.cache.forEach(element => {
                this.stream.write(`${element}\n`);
            });
            this.cache = [];
        }
    }

    public close(): void {
        this.cache.forEach(element => {
            this.stream.write(`${element}\n`);
        });
        this.stream.end();
    }

    public info(message: string): void { this.log(`[Info]`, message); }
    public warn(message: string): void { this.log(`[Warn]`, message); }
    public error(message: string): void { this.log(`[Error]`, message); }
    public fatal(message: string): void { this.log(`[Fatal]`, message); }
    public debug(message: string): void { this.log(`[Debug]`, message); }
    public trace(message: string): void { this.log(`[Trace]`, message); }

    public static getInstance(name?: string, dir?: string, cacheSize?: number): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(name, dir, cacheSize);
        }
        return Logger.instance;
    }
}

export default Logger;