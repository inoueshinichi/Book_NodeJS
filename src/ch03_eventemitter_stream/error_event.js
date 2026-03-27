'use strict'

const events = require('events')


// EventEmitterには`error`という名前のイベントによってエラーを伝播する規約がある.
// error用のリスナが存在せずに`error`エベントがemittされるとエラーを返す

try {
    new events.EventEmitter()
    // `error`イベントリスナの登録をコメントアウト
    // .on('error', err => console.log('errorイベント'))
    .emit('error', new Error('エラー'))
} catch (err) {
    console.error('catch')
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
    process.exit(1)
})