'use strict'

const { extname } = require('path')
const { readdir, readFile, writeFile, unlink } = require('fs').promises

// fetchAll
exports.fetchAll = async () => {
    // 同一ディレクトリ内に存在するJSONファイルをすべて取得
    const files = (await readdir(__dirname)).filter(file => extname(file) === '.json')
    return Promise.all(
        files.map(file => 
            readFile(`${__dirname}/${file}`, 'utf8').then(JSON.parse)
        )
    )
}

// fetchByCompleted
exports.fetchByCompleted = completed => exports.fetchAll()
    .then(all => all.filter(todo => todo.completed === completed))


// create
exports.create = todo =>
    writeFile(`${__dirname}/${todo.id}.json`, JSON.stringify(todo))


// update
exports.update = async (id, update) => {
    const fileName = `${__dirname}/${id}.json`
    return readFile(fileName, 'utf8').then(
        // resolve:
        (content) => {
            const todo = {
                ...JSON.parse(content),
                ...update,
            }
            return writeFile(fileName, JSON.stringify(todo)).then(() => todo)
        },
        // error: ファイルが存在しない場合はnullを返し、それ以外はそのままエラーとする
        (err) => err.code === 'ENOENT' ? null : Promise.reject(err)
    )
}

// remove
exports.remove = id => unlink(`${__dirname}/${id}.json`)
    .then(
        // resolve:
        () => id,
        // error:
        (err) => err.code === 'ENOENT' ? null : Promise.reject(err)
    )

