'use strict'

// 1024バイトのSharedArrayBufferを生成
const sharedArrayBuffer = new SharedArrayBuffer(1024)

// Uint8Arrayのビュー
const uint8Array = new Uint8Array(sharedArrayBuffer)
console.info(`uint8Array view: `, uint8Array)
console.info('uint8Array.length', uint8Array.length) // 1024


// Uint32Arrayのビュー
const uint32Array = new Uint32Array(sharedArrayBuffer)
console.info(`uint32Array view: `, uint32Array)
console.info('uint32Array.length', uint32Array.length) // 1024/4 = 256

uint32Array[0] = 1000
console.info('uint32Array.slice(0,1)', uint32Array.slice(0,1))
console.info('uint8Array.slice(0,4)', uint8Array.slice(0,4)) // 1 * 232 + 2^8 * 3 = 1000

uint32Array[1] = 2049
console.info('uint32Array.slice(1,2)', uint32Array.slice(1,2))
console.info('uint8Array.slice(4,8)', uint8Array.slice(4,8)) // 1 * 1 + 2^8 * 8 = 2049


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