'use strict'
const cluster = require('node:cluster')
const os = require('node:os')

console.log('メインプロセス', process.pid)

const cpuCount = os.cpus().length / 2
console.log('cpuCount', cpuCount)

for (let i = 0; i < cpuCount; i++) {
    cluster.setupPrimary({
        exec: "web-app.js",
        silent: false,
    })
    const subProcess = cluster.fork()
    console.log('サブプロセス', subProcess.process.pid)

    // IPCでサブプロセスにポート番号を送信
    subProcess.send(3000)

    // IPCで受信したメッセージをハンドリング
    subProcess.on('message', ({ pid, response }) => {
        console.log(process.pid, `${pid}が${response}を返します。`)
    })
}

