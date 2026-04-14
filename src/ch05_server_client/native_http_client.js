'use strict'

const http = require('node:http')
const os = require('node:os')

const testCase = 2
let /* ClientRequest(WritableStream) */ req = null

switch (testCase) {
    case 0:
        // GETメソッド
        // サーバーにリクエストを送る
        req = http.request(
            'http://localhost:3000/api/todos', 
            /* Callback(ReadableStream) */ res => {

            let resData = ''
            console.log(`statusCode`, res.statusCode)
            res.on('data', chunk => resData += chunk) // HTTPデータは複数のTCP送信で1セッションが決まる.
            res.on('end', () => console.log('resData', JSON.stringify(resData)))
        })
        req.end() // .end()でHTTPリクエストを送信
        break

    case 1:
        // POSTメソッド
        req = http.request(
            'http://localhost:3000/api/todos',
            { method: 'POST' },
            res => {
                console.log('statusCode', res.statusCode)
            }
        )
        req.end() // HTTP送信
        break
    
    case 2:
        req = http.request(
            'http://localhost:3000/api/foo',
            { method: 'GET' },
            res => {
                console.log('statusCode', res.statusCode)
            }
        )
        req.end()
        break
}





