'use strict'

const http = require('node:http')
const workerThreads = require('node:worker_threads')

const httpServer = http.createServer()
httpServer.on('request', (req, res) => {
    // HTTPリクエストを処理する
    // http://localhost:3000/10へのリクエストはreq.urlでは'/10'になるので、
    // そこから1文字目を取り除いてnを取得する

    const [slash, ...rest] = Array.from(req.url)
    // console.log('rest', rest)
    // console.log('rest.join()', rest.join(""))

    const n = Number(rest.join(""))
    console.log(`n: ${n}`)

    if (Number.isNaN(n)) {
        return res.end()
    }

    // コンストラクタの第二引数で値を渡しつつ、サブスレッドを生成
    new workerThreads.Worker(`${__dirname}/fibonacci.js`, {
        workerData: n
    }).on('message', result => {
        console.info(`fibonacci[${n}]-result: ${result.toString()}`)
        res.end(result.toString())
    }) // サブスレッドの戻り値をレスポンスとする
})

httpServer.listen(3000, 'localhost', () => {
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