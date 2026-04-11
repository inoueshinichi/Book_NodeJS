'use strict'

const http = require('node:http')
const os = require('node:os')
const ThreadPool = require('../thread-pool')


// 長さ1のInt32Arrayインスタンスを生成
const sharedArrayBuffer = new SharedArrayBuffer(4)
const int32Array = new Int32Array(sharedArrayBuffer)

const threadPool = new ThreadPool(
    os.cpus().length / 2,
    `${__dirname}/fibonacci.js`,
    { workerData: int32Array } // Int32Arrayインスタンスをスレッドプールに渡す
)

// メインスレッド側のカウンタ
let count = 0
const server = http.createServer()

server.on('request', async (req, res) => {
    // callsに対してはトラッキングしているリクエスト回数を返す
    if (req.url === '/calls') {
        return res.end(`Main = ${count}, Sub = ${int32Array[0]}`)
    }
    const n = Number(req.url.substr(1))
    console.log('n', n)
    if (Number.isNaN(n)) {
        return res.end()
    }

    if (n === 0) {
        return res.end()
    }

    count += 1
    const result = await threadPool.executeInThread(n)
    res.end(result.toString())
})


server.listen(3000, 'localhost', () => {
    console.info('サーバを起動しました')
})


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