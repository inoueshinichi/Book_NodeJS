'use strict'
// Main Thread
const perf_hooks = require('node:perf_hooks')
const worker_threads = require('node:worker_threads')


function useMaybeTransfer(transfer) {
    // 1GBのArrayBufferを生成
    const buffer = new ArrayBuffer(1024 * 1024 * 1024)

    // 現在時刻を記録
    const start = perf_hooks.performance.now()

    // ワーカースレッド起動
    new worker_threads.Worker(
        './maybe-transfer.js',
        {
            workerData: { buffer, transfer },
            // transferListプロパティに転送対象オブジェクトを指定
            transferList: transfer ? [buffer] : []
        }
    ).on('message', () => {
        // サブスレッドから値が戻ってくるまでにかかった時間を出力
        console.log(`elapsed time[transfer(${transfer})]: ${perf_hooks.performance.now() - start}`)
    })

    // サブスレッドに渡した値がどう見えるか確認
    console.log(buffer) // transfer:true => bufferはundefined.
}


// 転送を利用する場合
console.info('転送を利用する場合')
useMaybeTransfer(true)

// 転送を利用しない場合
console.info('転送を利用しない場合')
useMaybeTransfer(false)


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