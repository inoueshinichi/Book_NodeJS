'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')

const SERVER_PORT = 3000

// ToDo一覧
const todos = [
    { id: 1, title: 'ネーム', completed: false },
    { id: 2, title: '下書き', completed: true },
]

const server = express()

// 静的ファイルの公開
server.use('/static', express.static('public'))

// リクエストボディのパース
server.use(express.json()) // application/json; charset=utf-8
server.use(express.urlencoded({ extended: true })) // application/x-www-form-urlencoded by qsパッケージ

// Cookie処理
server.use(cookieParser())

// 前段のプロキシ対応
// X-Forwarded-Host: req.hostname
// X-Forwarded-Proto: req.protocol
// X-Forwarded-For: req.ip, req.ips
server.enable('trust proxy')


/* API */

// ToDo一覧の取得
server.get('/api/todos', async (req, res) => res.json(todos))


// 包括的エラーハンドリング
server.use((err, req, res, next) => {

})


server.listen(SERVER_PORT, () => console.log(`ポート番号${SERVER_PORT}でexpressサーバを起動しました.`))