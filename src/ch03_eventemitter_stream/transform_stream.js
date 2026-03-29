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


class LineTransformStream extends stream.Transform {
    // 上流から受け取ったデータのうち、下流に流していない分を
    // 保持するフィールド
    remaining = ''

    constructor(options) {
        super({ readableObjectMode: true, ...options })
    }

    _transform(chunk, encoding, callback) {
        console.log('_transform()')

        const lines = (chunk + this.remaining).split(/\n/)

        // 最後の行は次に入ってくるデータの先頭と同じ行になるため、変換を保持
        this.remaining = lines.pop()

        for (const line of lines) {
            // ここでpush()の戻り値は気にしない
            this.push({ message: line, delay: line.length * 100 })
        }
        callback()
    }

    _flush(callback) {
        console.log('_flush()')
        // 残っているデータを流しきる
        this.push({
            message: this.remaining,
            delay: this.remaining.length * 100
        })
        callback()
    }
}


const lineTransformStream = new LineTransformStream()
lineTransformStream.on('readable', () => {
    let chunk
    while ((chunk = lineTransformStream.read()) !== null) {
        console.log(chunk)
    }
})

lineTransformStream.write("foo\nbar")
lineTransformStream.write('baz')
lineTransformStream.end()


const lineTransformStream2 = new LineTransformStream()
lineTransformStream2.on('readable', () => {
    let chunk
    while ((chunk = lineTransformStream2.read()) !== null) {
        console.log(chunk)
    }
})
lineTransformStream2.write('tiny\ntank')
lineTransformStream2.write('developper')
lineTransformStream2.end()

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