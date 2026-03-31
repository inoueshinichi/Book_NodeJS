'use strict'

const cluster = require('node:cluster')
const os = require('node:os')

console.log('メインプロセス', process.pid)

// CPUコアの数だけプロセスをフォーク
const cpuCount = os.cpus().length

console.log('CPU count / 2', cpuCount/2)

for (let i = 0; i < cpuCount/2; i++) {
    cluster.setupPrimary({
        exec: "web-app.js",
        // silent: true,
    })
    const sub = cluster.fork()
    console.log('サブプロセス', sub.process.pid)
}