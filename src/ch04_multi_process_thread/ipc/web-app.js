'use strict'

const http = require('node:http')
const fibonacci = require('../fibonacci')
const pid = process.pid

// IPCでメッセージを受信して指定されたポート番号でWebサーバを起動
process.on('message', port => {
    console.log(pid, `ポート${port}でWebサーバを起動します`)
    http.createServer((req, res) => {
        const [slash, ...rest] = req.url
        const n = Number(Array.from(rest).join(""))
        if (Number.isNaN(n)) {
            return res.end()
        }
        const response = fibonacci(n)
        // 結果をIPCで送信
        process.send({ pid, response })
        res.end(response.toString())
    }).listen(port)
})

