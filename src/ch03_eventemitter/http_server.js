'use strict';

const http = require("http");

// サーバオブジェクト(EventEmitterインスタンス)を生成
const server = http.createServer();

// requestイベントのリスナ登録
server.on("request", (req, res) => {
    // レスポンスを返す
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.write("Hello World");
    res.end();
});

// listening(リクエストの受付開始)イベントのリスナ登録
server.on("listening", () => {
    console.log("response to listening event");
});

// errorイベントのリスナ登録
server.on("error", err => {
    console.log("response to error event");
});

// close(リクエストの受付終了)イベントのリスナ登録
server.on("close", () => {
    console.log("response to close event");
});

// サーバー起動
server.listen(8000);