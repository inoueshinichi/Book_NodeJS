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


// 継承クラス
class LanguagesReadableStream extends stream.Readable {
    constructor(options) {
        super(options)
        this.languages = [
            'JavaScript', 
            'TypeScript', 
            'Python', 
            'Ruby',
            'Java',
            'C#',
            'Rust',
            'C',
            'C++',
            'Dart',
            'Swift',
            'Kotlin',
        ]
    }

    _read(size) {
        console.log('_read()')
        let lang
        while ((lang = this.languages.shift())) {
            // push()でこのストリームからデータを渡す
            // ただし、push()がfalseを返すと終わり
            if (!this.push(`Tiny Tank can use ${lang}.\n`)) {
                console.log('読み込み中断')
                return
            }
        }
        // 最後にnullを渡してストリームの終了を通知する
        console.log('読み込み完了')
        this.push(null)
    }
}



// 継承クラス
class DelayLogStream extends stream.Writable {
    constructor(options) {
        // objectMode: trueを指定するとオブジェクトをデータとして流せる
        super({ objectMode: true, ...options})
    }

    _write(chunk, endcoding, callback) {
        console.log('_write()')
        // messageプロパティ(文字列), delayプロパティ(数値)を含むオブジェクトが
        // データとして流れてくることを期待
        const {message, delay} = chunk
        // delayで指定した時間(ミリ秒)だけ遅れてmessageをログに出す
        setTimeout(() => {
            console.log(message)
            callback()
        }, delay)
    }
}


// 継承クラス
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



// pipeによるストリームの連結
// pipeはエラーを補足しないので注意
// 各streamに自前で`error`リスナを登録しないといけない
new LanguagesReadableStream({ highWaterMark: 0 })
    .pipe(new LineTransformStream({
        // 二重ストリームのhighWaterMarkはwriteとreadのそれぞれ指定が必要
        writableHighWaterMark: 0,
        readableHighWaterMark: 0
    }))
    .pipe(new DelayLogStream({ highWaterMark: 0 }))
    .on('finish', () => console.log('完了'))


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