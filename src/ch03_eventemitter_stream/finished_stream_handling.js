'use strict'

const events = require('node:events')
const fs = require('node:fs')
const fs_promises = require('node:fs/promises')
const assert = require('node:assert')
const console = require('node:console')
const dns = require('node:dns')
const dns_promises = require('node:dns/promises')
const domain = require('node:domain')
const crypto = require('node:crypto')
const dgram = require('node:dgram')
const buffer = require('node:buffer')
const child_process = require('node:child_process')
const cluster = require('node:cluster')
const net = require('node:net')
const os = require('node:os')
const path = require('node:path')
const timers = require('node:timers')
const timers_promisses = require('node:timers/promises')
const http = require('node:http')
const https = require('node:https')
const worker_threads = require('node:worker_threads')
const process = require('node:process')
const inspector = require('node:inspector')
const inspector_promises = require('node:inspector/promises')
const readline = require('node:readline')
const readline_promises = require('node:readline/promises')
const zlib = require('node:zlib')
const async_hooks = require('node:async_hooks')
const constants = require('node:constants')
const stream = require('node:stream')
const diagnostics_channel = require('node:diagnostics_channel')
const perf_hooks = require('node:perf_hooks')
const util = require('node:util')
const v8 = require('node:v8')
const vm = require('node:vm')
const querystring = require('node:querystring')
// const quic = require('node:quic')
// const wasi = require('node:wasi')
const url = require('node:url')

const { pipeline, finished } = require('node:stream/promises')

// stream.finished()は, `end`, `finish`, `error`イベントなしで
// ストリームが終了した場合にも呼ばれる.
;(async () => {
    try {
        const myReadStream = fs.createReadStream('./data/src.txt')
        await pipeline(
            myReadStream,
            crypto.createHash('sha256'),
            fs.createWriteStream('./data/crypto.txt'),
        )

        // stream.finished or finished(promise化)で終了を監視
        // stream.finished(myReadStream, (err) => {
        //     if (err) {
        //         console.error('ReadStream finished with error: ', err)
        //     } else {
        //         // 正常終了時はerr===null
        //         console.info('Stream finished successfully.')
        //     }
        // })

        try {
            await finished(myReadStream)
            console.info('Stream finished successfully.')
        } catch(err) {
            console.error('ReadStream finished with error: ', err)
        }

        console.log('Pipeline completed successfully.')

    } catch (err) {
        console.error('Pipeline failed:', err)
    }

})()


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