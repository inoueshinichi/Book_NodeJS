'use strict'

const cp = require('node:child_process')


// サブプロセスを起動
const child = cp.fork(
    './ipc/web-app.js',
    { serialization: 'advanced' } // IPCに構造化クローンアルゴリズムを使う場合、fork()メソッドに指定する. default: 'json'
)
child.send(3000)


// OSのコマンドを発行する
// spawn(), exec()
cp.exec(
    'echo "Hello Tiny Tank!"',
    // 成功した場合、コマンドの標準出力を取得して表示. (サブプロセスの標準出力と標準エラー出力を親プロセスにパイプでつなぐ)
    (err, stdout) => err ? console.error(err) : console.log(stdout)
)