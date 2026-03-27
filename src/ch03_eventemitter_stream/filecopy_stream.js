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


function copyFileWithStream(src, dest, cb) {
    // ファイルから読み込みストリームを制し得
    fs.createReadStream(src)
        // ファイルから書き込みストリームを生成し、pipe()でつなぐ
        .pipe(fs.createWriteStream(dest))
        // 完了時にコールバックを呼び出す
        .on('finish', cb)
}


function encryptCopyFileWithStream(src, dest, cb) {
    fs.createReadStream(src)
        // 暗号化処理を追加
        .pipe(crypto.createHash('sha256'))
        .pipe(fs.createWriteStream(dest))
        .on('finish', cb)
}


function zipCopyFileWithStream(src, dest, cb) {
    fs.createReadStream(src)
        // 圧縮
        .pipe(zlib.createGzip())
        .pipe(fs.createWriteStream(dest))
        .on('finish', cb)
}


// コピー実行
copyFileWithStream('./data/src.txt', './data/dest.txt', () => console.log('コピー完了'))

// 暗号化して保存
encryptCopyFileWithStream('./data/src.txt', './data/crypto.txt', () => console.log('暗号化してコピー完了'))

// 圧縮して保存
zipCopyFileWithStream('./data/src.txt', './data/zip.txt', () => console.log('圧縮して保存完了'))


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