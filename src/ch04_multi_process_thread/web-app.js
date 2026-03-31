'use strict'

const http = require('http')
const fibonacci = require('./fibonacci')

let reqCount = 0

const server = http.createServer()
server.on('request', (req, res) => {
    // http://localhost:3000/10へのリクエストはreq.urlでは'/10'になるので、
    // そこから1文字目を取り除いてnを取得する

    const [slash, ...rest] = Array.from(req.url)
    // console.log('rest', rest)
    // console.log('rest.join()', rest.join(""))

    reqCount++;
    const n = Number(rest.join(""))
    console.log(`[${reqCount}] n: ${n}`)

    if (Number.isNaN(n)) {
        return res.end()
    }

    const result = fibonacci(n)
    res.end(result.toString())
    // res.end()
})

server.listen(3000, 'localhost', () => {
    console.info('サーバを起動しました')
})