'use strict'

const fibonacci = require('../fibonacci')
const workerThreads = require('node:worker_threads')

// フィボナッチ数の計算結果をメインスレッドに送信
workerThreads.parentPort.postMessage(fibonacci(workerThreads.workerData))

