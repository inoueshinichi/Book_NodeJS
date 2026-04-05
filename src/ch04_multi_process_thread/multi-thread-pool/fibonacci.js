'use strict'

const fibonacci = require('../fibonacci')
const { parentPort } = require('node:worker_threads')

// messageイベントの監視によりメインスレッドからのメッセージの受信を待機、
// 受診したらフィボナッチ数を計算して、結果をメインスレッドに送信
parentPort.on('message', n => parentPort.postMessage(fibonacci(n)))

