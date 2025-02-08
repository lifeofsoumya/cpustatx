const os = require('os');
const Table = require('cli-table3');

let oldCpus;

function captureCPUSnapshot() {
  return os.cpus().map(cpu => ({
    times: { ...cpu.times }, // Clone CPU times
    total: Object.values(cpu.times).reduce((a, b) => a + b, 0)
  }));
}

function calculateCoreUsage(oldCpu, newCpu) {
  const totalDiff = newCpu.total - oldCpu.total;
  const idleDiff = newCpu.times.idle - oldCpu.times.idle;
  return ((totalDiff - idleDiff) / totalDiff * 100).toFixed(2) + '%';
}

function monitorCPU() {
  const mainTable = new Table({
    head: ['CPU Cores', 'Model', 'Arch', 'Platform', 'Release', 'Total Usage', 'Free Mem', 'Total Mem', 'Uptime']
  });

  const coreTable = new Table({ head: ["Core #", "Usage (%)"] });

  // Initial capture
  oldCpus = captureCPUSnapshot();

  setInterval(() => {
    // Get new snapshot
    const newCpus = captureCPUSnapshot();

    // Calculate core usages
    const coreData = newCpus.map((cpu, i) => [
      `Core ${i + 1}`,
      calculateCoreUsage(oldCpus[i], newCpus[i])
    ]);

    // Calculate total usage
    const totalIdle = newCpus.reduce((sum, cpu) => sum + cpu.times.idle, 0) - 
                      oldCpus.reduce((sum, cpu) => sum + cpu.times.idle, 0);
    const totalUsed = newCpus.reduce((sum, cpu) => sum + cpu.total, 0) - 
                      oldCpus.reduce((sum, cpu) => sum + cpu.total, 0);
    const totalUsage = ((totalUsed - totalIdle) / totalUsed * 100).toFixed(2) + '%';

    // Update main table
    mainTable.splice(0, mainTable.length);
    mainTable.push([
      os.cpus().length,
      os.cpus()[0].model,
      os.arch(),
      os.platform(),
      os.release(),
      totalUsage,
      `${(os.freemem() / 1024 / 1024).toFixed(1)} MB`,
      `${(os.totalmem() / 1024 / 1024).toFixed(1)} MB`,
      `${(os.uptime() / 60 / 60).toFixed(1)} hrs`
    ]);

    // Update core table
    coreTable.splice(0, coreTable.length);
    coreTable.push(...coreData);

    // Clear and redraw
    console.clear();
    console.log("============================");
    console.log(" REAL-TIME CPU MONITOR ");
    console.log("============================");
    console.log(mainTable.toString());
    console.log("\n⚡ LIVE CORE USAGE:");
    console.log(coreTable.toString());

    // Update old snapshot
    oldCpus = newCpus;
  }, 1000);
}

monitorCPU();