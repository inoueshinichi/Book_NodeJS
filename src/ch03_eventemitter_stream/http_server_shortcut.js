'use strict'


const http = require('http')

// コールバッグメソッド方式は.on('イベント', () => {})のショートカットに過ぎない

// サーバオブジェクトを作成 : EventEmitterのインスタンスを作成
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json'})
    const resJson = {
        name: 'Tiny Tank',
        age: 35,
        gender: 'male',
        hobby: 'making'
    }
    res.write(JSON.stringify(resJson))
    res.end()
})


// サーバー起動
server.listen(8000, () => {
    console.log('start server')
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
    process.exit(1)
})
