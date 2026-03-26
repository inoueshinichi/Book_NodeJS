'use strict'

/* Observerパターン
監視対象(Subject) : EventEmitter
監視役(Observer) : Listener
※ Observerは、あらかじめSubjectに対して監視を行うための登録処理を行い、
   Subjectはイベント発生のタイミングで登録済みObserverに対して通知処理を実行する.
*/

const http = require('http')

// サーバオブジェクトを作成 : EventEmitterのインスタンスを作成
const server = http.createServer()

// requestイベントのリスナを登録
server.on('request', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain'})
    res.write("Tiny Tank");
    res.end()
})

// listening(リクエスト受付開始)イベントのリスナ登録
server.on('listening', () => {

})

// errorイベントのリスナ登録
server.on('error', err => {

})

// close(リクエストの受付終了)イベントのリスナ登録
server.on('close', () => {

})


// サーバー起動
server.listen(8888)


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

