const os = require('node:os');

function monitor() {
    const oldCpus = os.cpus();

    setTimeout(() => {
        const newCpus = os.cpus();
        const usage = newCpus.map((cpu, i) => ({
            'Core': `Core ${i + 1}`,
            'Usage (%)': calculateCPU(oldCpus[i], newCpus[i])
        }));

        console.clear();
        console.table(usage, ['Core', 'Usage (%)']);
        console.log("\n⚡ Load Average (1m | 5m | 15m):", os.loadavg().map(n => n.toFixed(2)).join(" | "));
    }, 1000);
}

function calculateCPU(oldCpu, newCpu) {
    const oldTotal = Object.values(oldCpu.times).reduce((a, b) => a + b, 0);
    const newTotal = Object.values(newCpu.times).reduce((a, b) => a + b, 0);

    const idle = newCpu.times.idle - oldCpu.times.idle;
    const total = newTotal - oldTotal;
    const used = total - idle;

    return ((100 * used) / total).toFixed(2);
}

setInterval(monitor, 1000);
monitor();