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


// evnents.on()メソッドを使ってEventEmitterインスタンスの
// 特定のイベントに対応するasyncイテラブルを生成する.

const eventAEventEmitter = new events.EventEmitter()


// asyncイテラブルの生成
const eventAIterable = events.on(eventAEventEmitter, 'eventA')
console.log(eventAIterable);


// プログラムの実行がfor await...ofの先に進めるように即時実行する
(async () => {
    for await (const a of eventAIterable) {
        // aの値はeventAをemit()したときの引数の入れ宇t
        if (a[0] === 'end') {
            break
        }
        console.log('event: ', a)
    }
})()


eventAEventEmitter.emit('eventA', 'Hello')
eventAEventEmitter.listeners('eventA')
eventAEventEmitter.emit('eventA', 'Hello', 'World')
eventAEventEmitter.emit('end')
eventAEventEmitter.listeners('eventA')



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



