"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const perf_hooks_1 = require("perf_hooks");
class Timer {
    constructor(name) {
        this.name = name;
        this.start = perf_hooks_1.performance.now();
    }
    stop() {
        const time = perf_hooks_1.performance.now() - this.start;
        console.log(`${this.name} finished in ${Math.round(time)} ms`);
    }
}
exports.Timer = Timer;
//# sourceMappingURL=Timer.js.map