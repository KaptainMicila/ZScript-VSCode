import { performance } from "perf_hooks";

export class Timer {
    readonly start = performance.now();

    constructor(private readonly name: string) { }

    stop() {
        const time = performance.now() - this.start;
        console.log(`${this.name} finished in ${Math.round(time)} ms`);
    }
}
