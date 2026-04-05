'use strict'

// Web標準のWebワーカーをV8エンジンに移植したもの

const workerThreads = require('node:worker_threads')
const os = require('node:os')

console.info('メインスレッド', workerThreads.threadId)

// CPUコア数分のスレッドを起動
const cpuCount = os.cpus().length
console.log('CPU数', cpuCount)

for (let i = 0; i < cpuCount; i++) {
    // サブスレッドで実行するファイルのパスを指定してWorkerをnew
    const worker = new workerThreads.Worker(`${__dirname}/web-app.js`)
    console.info('サブスレッド', worker.threadId)
}


/* Nodejsオンリーな処理 */
process.on('unhandledRejection', 
    (
        err, // Promiseの拒否理由
        promise // 放置されたrejectedなPromise
    ) => {
        // unhandledRejecction発生の原因を調べられるよう、ログ出力などの対応を行う
        console.error('unhandledRejection発生', err)
    }
)
process.on('uncaughtException', err => {
    // プロセス終了前に必要な後片付けやログ出力を行う
    // process.exit(1)により必ずプロセスをエラー終了させること
    console.error(err)
    process.exit(1)
})